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
  console.log("Looking for gameStats for ", gameName);
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
  console.log("Inserting New Session: ", session);
  // Get latest session Id and create session
  const latestSession = await prisma.session.findFirst({
    orderBy: {
      sessionId: "desc",
    },
  });

  const newSessionId = latestSession ? latestSession.sessionId + 1 : 1;

  console.log("Trying new sessio ID: ", newSessionId);

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
        date: session.date,
      },
    });
  }

  // For each set in the session assign to parent session
  session.sets.forEach(async (set: any) => {
    console.log("Creating Set From Admin Form Submission: ", set);

    // const setWinnerConect = await set.setWinners.map((winner: any) => ({
    //   playerId: winner.playerId,
    // }));

    const setWinnerConnect = (set.setWinners || []).map((winner: any) => ({
      playerId: winner.playerId,
    }));

    console.log("Set Winners: ", setWinnerConnect);
    console.log("New session ID: ", newSessionId);

    const newSet = await prisma.gameSet.create({
      data: {
        sessionId: newSessionId,
      },
    });

    const updateSetWinners = await prisma.gameSet.update({
      where: {
        setId: newSet.setId,
      },
      data: {
        setWinners: {
          connect: setWinnerConnect,
        },
      },
    });

    console.log("New Set ID: ", newSet.setId);

    // For each match in set assign to parent set
    set.matches.forEach(async (match: any) => {
      console.log("Creating Match From Admin Form Submission: ", match);

      const matchWinnerConnect = match.matchWinners.map((winner: any) => ({
        playerId: winner.playerId,
      }));

      const newMatch = await prisma.match.create({
        data: {
          setId: newSet.setId,
          matchWinners: {
            connect: matchWinnerConnect,
          },
        },
      });

      // For each PlayerSession in  match assign to parent match`
      match.playerSessions.forEach(async (playerSession: any) => {
        console.log(
          "Creating PlayerSession From Admin Form Submission: ",
          playerSession,
        );

        console.log("PlayerSession PlayerId: ", playerSession.playerId);

        const playerSessionPlayer = await prisma.player.findFirst({
          where: {
            playerId: playerSession.playerId,
          },
        });

        console.log("Found PlayerSessionPlayer: ", playerSessionPlayer);

        if (playerSessionPlayer) {
          const newPlayerSession = await prisma.playerSession.create({
            data: {
              playerId: playerSession.playerId,
              sessionId: newSessionId,
              matchId: newMatch.matchId,
              setId: newSet.setId,
            },
          });

          // For each playerStat in playerSession assign to parent playerSession
          playerSession.playerStats.forEach(async (playerStat: any) => {
            console.log(
              "Creating PlayerStat From Admin Form Submission: ",
              playerStat,
            );

            const gameStat = await prisma.gameStat.findFirst({
              where: {
                statName: playerStat.stat,
              },
            });

            console.log("Found Game Stat: ", gameStat);

            console.log("PlayerSessionId: ", newPlayerSession.playerSessionId);
            console.log("Value: ", playerStat.statValue);
            console.log("PlayerId: ", newPlayerSession.playerId);
            console.log("GameId: ", sessionGame!.gameId);
            console.log("StatId: ", gameStat!.statId);
            console.log("Date: ", session.date);

            const newPlayerStat = await prisma.playerStat.create({
              data: {
                playerSessionId: newPlayerSession.playerSessionId,
                value: playerStat.statValue,
                playerId: newPlayerSession.playerId,
                gameId: sessionGame!.gameId,
                statId: gameStat!.statId,
                date: session.date,
              },
            });

            console.log("newPlayerStat Created: ", newPlayerStat);
          });

          // if (playerSessionPlayer) {
          //   const newPlayerSession = await prisma.playerSession.create({
          //     data: {
          //       playerId: playerSession.playerId,
          //       sessionId: newSessionId,
          //       matchId: newMatch.matchId,
          //       setId: newSet.setId,
          //     },
          //   });

          //   // For each playerStat in playerSession assign to parent playerSession
          //   playerSession.playerStats.forEach(async (playerStat: any) => {
          //     console.log(
          //       "Creating PlayerStat From Admin Form Submission: ",
          //       playerStat,
          //     );

          //     // Get stat ID for stat Name // TODO: fix this to be more efficient
          //     // StatID in playerStatAdmin form should be same as db
          //     const gameStat = await prisma.gameStat.findFirst({
          //       where: {
          //         statName: playerStat.stat,
          //       },
          //     });

          //     await prisma.playerStat.create({
          //       data: {
          //         playerSessionId: newPlayerSession.playerSessionId,
          //         value: playerStat.statValue,
          //         playerId: newPlayerSession.playerId,
          //         gameId: sessionGame!.gameId,
          //         statId: gameStat!.statId,
          //       },
          //     });
        }
      });
    });
  });
};
