"use server";

import { auth } from "@/auth";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { ProcessedSet } from "../(routes)/(groups)/games/[slug]/_components/match-data";
// import { createStreamableValue } from "@ai-sdk/rsc";

import { mvpSystemPrompt } from "./prompts";
import prisma, { handlePrismaOperation } from "prisma/db";
import {
  logMvpUpdateFailure,
  logMvpUpdateSuccess,
} from "@/posthog/server-analytics";
import { after } from "next/server";
import { revalidateTag } from "next/cache";
import { MvpOutput, mvpSchema } from "./types";

export const analyzeMvp = async (
  sets: ProcessedSet[],
  sessionId: number,
): Promise<MvpOutput> => {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    // Fast path: If MVP is already calculated, return it immediately.
    const existingSession = await prisma.session.findFirst({
      where: { sessionId, mvpId: { not: null } },
      include: { mvp: true }, // Include the player relation
    });

    if (existingSession && existingSession.mvp) {
      return {
        description: existingSession.mvpDescription ?? "",
        stats: existingSession.mvpStats as MvpOutput["stats"],
        player: existingSession.mvp.playerName,
      };
    }

    const now = performance.now();

    const { object, usage } = await generateObject({
      schema: mvpSchema,
      model: google("gemini-2.5-pro"),
      system: mvpSystemPrompt,
      prompt: `Analyze the following game sets and determine the MVP based on the provided statistics: ${JSON.stringify(
        sets,
      )}`,
    });

    console.log("Total usage:", usage);

    const player = await prisma.player.findFirst({
      where: { playerName: { startsWith: object.player } },
    });

    // Atomically update the session ONLY if an MVP has not been set.
    const updateResult = await handlePrismaOperation((prisma) =>
      prisma.session.updateMany({
        where: {
          sessionId,
          mvpId: null,
        },
        data: {
          mvpDescription: object.description,
          mvpStats: object.stats,
          mvpId: player?.playerId,
        },
      }),
    );

    const duration = (performance.now() - now) / 1000;

    // If we successfully updated the record (count > 0), we won the race.
    if (updateResult.success && updateResult.data.count > 0) {
      revalidateTag("getAllSessions");
      after(() =>
        logMvpUpdateSuccess(sessionId, object, new Date(), duration, session),
      );
      return object;
    }

    // If count is 0, we lost the race. Another process set the MVP.
    // Fetch the data that the other process just wrote.
    const newlyUpdatedSession = await prisma.session.findFirstOrThrow({
      where: { sessionId },
      include: { mvp: true },
    });

    // TODO Maybe remove
    // This should be an impossible state, but handle it defensively.
    if (!newlyUpdatedSession.mvp)
      throw new Error("MVP data not found after race condition loss.");

    return {
      description: newlyUpdatedSession.mvpDescription ?? "",
      stats: newlyUpdatedSession.mvpStats as MvpOutput["stats"],
      player: newlyUpdatedSession.mvp.playerName,
    };
  } catch (error) {
    console.log(error);
    after(async () => await logMvpUpdateFailure(sessionId, error));
    throw error;
  }
};
