"use server";

import { Game, GameStat, Player } from "@prisma/client";
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
    const newSession = await prisma.session.upsert({
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

    console.log("\n--- New Session Created: ---", newSession);
  }

  // For each set in the session assign to parent session
  await Promise.all(
    session.sets.map(async (set: any) => {
      console.log("\n-- Creating Set From Admin Form Submission:  -- \n", set);

      // const setWinnerConect = await set.setWinners.map((winner: any) => ({
      //   playerId: winner.playerId,
      // }));

      const setWinnerConnect = await (set?.setWinners ?? []).map(
        (winner: any) => ({
          playerId: winner.playerId,
        }),
      );

      console.log("Set Winners: ", setWinnerConnect);
      console.log("New session ID: ", newSessionId);

      const newSet = await prisma.gameSet.create({
        data: {
          sessionId: newSessionId,
        },
      });

      console.log("New Set ID: ", newSet.setId);

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

      // For each match in set assign to parent set
      await Promise.all(
        set.matches.map(async (match: any) => {
          console.log("\n - Creating Match  - \n", match);

          const matchWinnerConnect =
            match?.matchWinners?.map((winner: any) => ({
              playerId: winner.playerId,
            })) ?? [];

          console.log("Match Winners: ", matchWinnerConnect);
          console.log("Set: ", set);

          const newMatch = await prisma.match.create({
            data: {
              setId: newSet.setId,
              matchWinners: {
                connect: matchWinnerConnect,
              },
            },
          });

          console.log("New Match Created: ", newMatch);

          // For each PlayerSession in match assign to parent match`
          await Promise.all(
            match.playerSessions.map(async (playerSession: any) => {
              console.log(
                "\n  --- Creating PlayerSession  ---\n",
                playerSession,
              );

              const playerSessionPlayer = await prisma.player.findUnique({
                where: {
                  playerId: playerSession.playerId,
                },
              });

              if (!playerSessionPlayer) {
                console.log(
                  "!!! ERROR Player Not Found: !!!",
                  playerSession.playerId,
                );
                return false;
              }

              console.log(
                `Values to be inserted into newPlayerSession: PlayerId: ${playerSession.playerId}, SessionId: ${newSessionId}, MatchId: ${newMatch.matchId}, SetId: ${newSet.setId}`,
              );

              const newPlayerSession = await prisma.playerSession.create({
                data: {
                  playerId: playerSession.playerId,
                  sessionId: newSessionId,
                  matchId: newMatch.matchId,
                  setId: newSet.setId,
                },
              });

              console.log("New PlayerSession Created: ", newPlayerSession);

              // For each playerStat in playerSession assign to parent playerSession
              await Promise.all(
                playerSession.playerStats.map(async (playerStat: any) => {
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

                  console.log(
                    "PlayerSessionId: ",
                    newPlayerSession.playerSessionId,
                  );
                  console.log("Value: ", playerStat.statValue);
                  console.log("PlayerId: ", newPlayerSession.playerId);
                  console.log("GameId: ", sessionGame!.gameId);
                  console.log("StatId: ", gameStat!.statId);
                  console.log("Date: ", session.date);

                  const sessionDate = new Date(session.date);
                  console.log("Session Date: ", sessionDate);

                  const newPlayerStat = await prisma.playerStat.create({
                    data: {
                      playerId: newPlayerSession.playerId,
                      gameId: sessionGame!.gameId,
                      playerSessionId: newPlayerSession.playerSessionId,
                      statId: gameStat!.statId,
                      value: playerStat.statValue,
                      date: sessionDate,
                    },
                  });

                  console.log("newPlayerStat Created: ", newPlayerStat);
                }),
              );
            }),
          );
        }),
      );
    }),
  );
};
