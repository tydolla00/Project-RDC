"use server";

import { auth } from "@/auth";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { ProcessedSet } from "../(routes)/(groups)/games/[slug]/_components/match-data";
// import { createStreamableValue } from "@ai-sdk/rsc";

import { z } from "zod";
import { mvpSystemPrompt } from "./prompts";
import prisma, { handlePrismaOperation } from "../../../prisma/db";
import {
  logMvpUpdateFailure,
  logMvpUpdateSuccess,
} from "@/posthog/server-analytics";
import { after } from "next/server";
import { revalidateTag } from "next/cache";

const output = z.object({
  player: z.string(),
  description: z.string(),
  stats: z.array(
    z.object({
      statName: z.string().meta({ description: "The name of the statistic" }),
      sum: z
        .number()
        .nonnegative()
        .meta({ description: "Total of the stat for the whole session" }),
      average: z
        .number()
        .nonnegative()
        .optional()
        .meta({ description: "Average of the stat for the whole session" }),
    }),
  ),
});

export type MvpOutput = z.infer<typeof output>;

export const analyzeMvp = async (sets: ProcessedSet[], sessionId: number) => {
  try {
    const session = await auth();

    if (!session) throw new Error("Unauthorized");

    const { object, usage } = await generateObject({
      schema: output,
      model: google("gemini-2.5-pro"),
      system: mvpSystemPrompt,
      prompt: `Analyze the following game sets and determine the MVP based on the provided statistics: ${JSON.stringify(sets)}`,
    });

    // Update the Mvp record after request finishes.
    after(async () => {
      const player = await prisma.player.findFirst({
        where: { playerName: { startsWith: object.player } },
      });

      const res = await handlePrismaOperation(() =>
        prisma.session.update({
          where: { sessionId },
          data: {
            mvpDescription: object.description,
            mvpStats: object.stats,
            mvpId: player?.playerId,
          },
        }),
      );
      if (!res.success)
        await logMvpUpdateFailure(sessionId, res.error, session);
      else {
        revalidateTag("getAllSessions");
        await logMvpUpdateSuccess(
          sessionId,
          object,
          res.data.updatedAt,
          session,
        );
      }
    });

    console.log("Total usage:", usage);
    return object;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const streamVersion = () => {
//     const stream = createStreamableValue();

//     (async () => {
//       const { partialObjectStream } = streamObject({
//         schema: output,
//         model: google("gemini-2.5-pro"),
//         system: `You are a helpful assistant that analyzes video game data and decides the best MVP (Most Valuable Player) based on performance metrics.
//         You may be given data from Rocket League, Call of Duty, Speedrunners, Mario Kart, or any other game.
//         Your task is to analyze the provided data and determine the player who has shown the most outstanding performance in the given game.
//         Consider factors such as win rate, kills, assists, and other relevant statistics to make your decision. State your reasoning clearly and provide the name of the MVP player.

//         OUTPUT:
//         Description: You will provide a description of the MVP player, including their name and why they were chosen as the MVP.
//         Stats: You will provide a summary of the player's performance statistics as an array of objects. Each object should contain the 'statName', 'sum' (total value), and 'average' for that statistic.
//         Player: You will provide the name of the MVP player.

//         If you are given data from a game that you do not recognize, respond with "I am not familiar with this game."

//         For a Rocket League session, you will receive data in the following format:
//         [
//             {
//                 setWinners: ["Player1", "Player2"],
//                 matches: [
//                     {
//                         matchWinners: ["Player1"],
//                         players: [
//                             { player: "Player1", score: 100, goals: 5, assists: 2, saves: 1, shots: 10 },
//                             { player: "Player2", score: 80, goals: 3, assists: 1, saves: 2, shots: 8 },
//                         ],
//                     },
//                     {
//                         matchWinners: ["Player2"],
//                         players: [
//                             { player: "Player1", score: 90, goals: 4, assists: 3, saves: 1, shots: 9 },
//                             { player: "Player2", score: 85, goals: 2, assists: 2, saves: 3, shots: 7 },
//                         ],
//                     },
//                 ],
//             };
//         ]
//         `,
//         prompt: `Analyze the following game sets and determine the MVP based on the provided statistics: ${JSON.stringify(sets)}`,
//       });
//       for await (const partialObject of partialObjectStream)
//         stream.update(partialObject);

//       stream.done();
//     })();

//     return { object: stream.value };
// };
