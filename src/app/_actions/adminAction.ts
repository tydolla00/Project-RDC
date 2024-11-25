"use server";

import { Game, GameStat } from "@prisma/client";
import prisma from "../../../prisma/db";
import { FormValues } from "../(routes)/admin/_components/EntryCreatorForm";

/**
 * Get all game objects from the database
 *
 * @returns {Promise<Game[]>} A promise that resolves to an array of game objects
 */
export async function getGames(): Promise<Game[]> {
  const games = await prisma.game.findMany();
  return games;
}

export async function getGameStats(gameName: string): Promise<GameStat[]> {
  console.log("Lookign for gameStats for ", gameName);
  const game = await prisma.game.findFirst({
    where: {
      gameName: gameName,
    },
  });

  if (!game) {
    throw new Error(`Game with name ${gameName} not found`);
  }

  const gameId = game.gameId;
  const gameStats = await prisma.gameStat.findMany({
    where: {
      gameId: gameId,
    },
  });
  return gameStats;
}

export const insertNewSessionFromAdmin = async (session: FormValues) => {
  // Get latest session Id and create session
  const latestSession = await prisma.session.findFirst({
    orderBy: {
      sessionId: "desc",
    },
  });

  const newSessionId = latestSession ? latestSession.sessionId + 1 : 1;

  const sessionGame = await prisma.game.findFirst({
    where: {
      gameName: session.game,
    },
  });

  if (sessionGame) {
    await prisma.session.upsert({
      where: { sessionId: newSessionId },
      update: {},
      create: {
        sessionId: newSessionId,
        gameId: sessionGame.gameId,
        sessionName: session.sessionName,
        sessionUrl: session.sessionUrl,
        thumbnail: session.thumbnail,
        // date: Date.now(), // TODO: Add Date Picker or get date from youtube video
      },
    });
  }

  // For each set in the session assign to parent session
  session.sets.forEach(async (set: any) => {
    await prisma.gameSet.create({
      data: {
        sessionId: newSessionId,
        ...set,
      },
    });
    // For each playerSession in set assign to parent set
    set.playerSessions.forEach(async (playerSession: any) => {
      await prisma.playerSession.create({
        data: {
          setId: set.setId,
          ...playerSession,
        },
      });

      // For each playerStat in each playerSession assign to parent playerSession`
      playerSession.playerStats.forEach(async (playerStat: any) => {
        await prisma.playerStat.create({
          data: {
            playerSessionId: playerSession.playerSessionId,
            ...playerStat,
          },
        });
      });
    });
  });
};
