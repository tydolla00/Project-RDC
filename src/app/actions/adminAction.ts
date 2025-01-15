"use server";

import { $Enums, Game, GameStat, Player } from "@prisma/client";
import { v4 } from "uuid";
import prisma from "../../../prisma/db";
import { FormValues } from "../(routes)/admin/_utils/form-helpers";
import { getAllGames } from "../../../prisma/lib/games";
import { auth } from "@/auth";
import { errorCodes } from "@/lib/constants";
import { randomInt } from "crypto";

/**
 * Retrieves the statistics for a specified game.
 *
 * @param {string} gameName - The name of the game to retrieve statistics for.
 * @returns {Promise<GameStat[]>} A promise that resolves to an array of game statistics.
 * @throws {Error} If the game with the specified name is not found.
 */
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

/**
 * Inserts a new session from the admin panel.
 *
 * @param {FormValues} session - The session details to be inserted.
 * @returns {Promise<{ error: null | string }>} - A promise that resolves to an object containing an error message if any error occurs, otherwise null.
 *
 * @example
 * const session = {
 *   game: "Game Name",
 *   sessionName: "Session Name",
 *   sessionUrl: "http://example.com",
 *   thumbnail: "http://example.com/thumbnail.jpg",
 *   date: "2023-10-01",
 *   sets: [
 *     {
 *       setWinners: [{ playerId: 1 }],
 *       matches: [
 *         {
 *           matchWinners: [{ playerId: 1 }],
 *           playerSessions: [
 *             {
 *               playerId: 1,
 *               playerStats: [{ stat: "Score", statValue: 100 }],
 *             },
 *           ],
 *         },
 *       ],
 *     },
 *   ],
 * };
 * const result = await insertNewSessionFromAdmin(session);
 * console.log(result); // { error: null }
 *
 * @throws {Error} Throws an error if an unknown error occurs.
 */
export const insertNewSessionFromAdmin = async (
  session: FormValues,
): Promise<{ error: null | string }> => {
  console.log("Inserting New Session: ", session);
  try {
    const isAuthenticated = await auth();
    if (!isAuthenticated) return { error: errorCodes.NotAuthenticated };

    const sessionGame = await prisma.game.findFirst({
      where: {
        gameName: session.game,
      },
    });

    if (!sessionGame) {
      // TODO This should never happen game should be required.
      return { error: "Game not found." };
    } else {
      const videoAlreadyExists = await prisma.videoSession.findFirst({
        where: {
          gameId: sessionGame?.gameId,
          AND: { sessionName: session.sessionName },
        },
      });

      if (videoAlreadyExists) return { error: "Video already exists." };
    }

    const newSession = await prisma.videoSession.create({
      data: {
        gameId: sessionGame.gameId,
        sessionName: session.sessionName,
        sessionUrl: session.sessionUrl,
        thumbnail: session.thumbnail,
        date: session.date,
      },
    });
    const newSessionId = newSession.sessionId; // ! TODO Remove
    console.log("\n--- New Session Created: ---", newSession);

    // For each set in the session assign to parent session
    // TODO We might want to change these to be transactions. Need to explain the promise.all to me. Also may want to wrap in try catch
    await Promise.all(
      session.sets.map(async (set) => {
        console.log(
          "\n-- Creating Set From Admin Form Submission:  -- \n",
          set,
        );

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
          set.matches.map(async (match) => {
            console.log("\n - Creating Match  - \n", match);

            const matchWinnerConnect =
              match?.matchWinners?.map((winner) => ({
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
              match.playerSessions.map(async (playerSession) => {
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
                  playerSession.playerStats.map(async (playerStat) => {
                    console.log(
                      "Creating PlayerStat From Admin Form Submission: ",
                      playerStat,
                    );

                    const gameStat = await prisma.gameStat.findFirst({
                      where: {
                        statName: playerStat.stat as $Enums.StatName,
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
    return { error: null };
  } catch (error) {
    return { error: "Unknown error occurred. Please try again." };
  }
};

/**
 * Inserts a new video session into the database.
 *
 * @param {Object} params - The parameters for the new session.
 * @param {string} params.sessionUrl - The URL of the session video.
 * @param {string} params.sessionName - The name of the session.
 * @param {Array} params.sets - The sets associated with the session.
 * @param {string} params.game - The name of the game.
 * @param {string} params.thumbnail - The thumbnail image URL for the session.
 * @param {Date} params.date - The date of the session.
 * @returns {Promise<{ error: string | null }>} - An object containing an error message if any, otherwise null.
 *
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If the game is not found in the database.
 * @throws {Error} If the video session already exists in the database.
 *
 * @async
 */
export const insertNewSessionV2 = async ({
  sessionUrl,
  sessionName,
  sets,
  game,
  thumbnail,
  date, // Can we remove data from the tables.
}: FormValues): Promise<{ error: string | null }> => {
  const gameId = (await getAllGames()).find((g) => g.gameName === game)?.gameId;
  const isAuthenticated = await auth();
  if (!isAuthenticated) return { error: errorCodes.NotAuthenticated };

  //? Check if the game and video exists in the db.
  // TODO This should never happen game should be required.
  if (!gameId) return { error: "Game not found." };
  else {
    const videoAlreadyExists = await prisma.videoSession.findFirst({
      where: {
        gameId,
        AND: { sessionName },
      },
    });

    if (videoAlreadyExists) return { error: "Video already exists." };
  }

  const prismaSets: any[] = [];
  // const sessionId = v4() as unknown as number; // temporary bc of conflicting id types
  const sessionId = randomInt(100000);
  const gameStats = await getGameStats(game);

  prismaSets.push(
    prisma.videoSession.create({
      data: {
        sessionId,
        sessionName,
        sessionUrl,
        thumbnail,
        gameId,
      },
    }),
  );

  sets.forEach((set) => {
    // const setId = v4() as unknown as number;
    const setId = randomInt(100000);
    prismaSets.push(
      prisma.videoSession.update({
        where: { sessionId },
        data: {
          sets: {
            create: {
              setId,
              setWinners: {
                connect: set.setWinners.map((sw) => ({
                  playerId: sw.playerId,
                })),
              },
            },
          },
        },
      }),
    );

    set.matches.forEach((match) => {
      // const matchId = v4() as unknown as number;
      const matchId = randomInt(100000);
      prismaSets.push(
        prisma.gameSet.update({
          where: { setId },
          data: {
            matches: {
              create: {
                matchId,
                matchWinners: {
                  connect: match.matchWinners.map((mw) => ({
                    playerId: mw.playerId,
                  })),
                },
              },
            },
          },
        }),
      );

      match.playerSessions.forEach((ps) => {
        // const playerSessionId = v4() as unknown as number;
        const playerSessionId = randomInt(100000);
        prismaSets.push(
          prisma.gameSet.update({
            where: { setId },
            data: {
              playerSessions: {
                create: {
                  sessionId,
                  matchId,
                  playerSessionId,
                  playerId: ps.playerId,
                },
              },
            },
          }),
        );

        ps.playerStats.forEach((stat) => {
          prismaSets.push(
            prisma.playerSession.update({
              where: { playerSessionId },
              data: {
                playerStats: {
                  createMany: {
                    data: [
                      {
                        gameId,
                        playerId: ps.playerId,
                        value: stat.statValue,
                        statId: gameStats.find(
                          (gs) => gs.statName === stat.stat,
                        )!.statId,
                      },
                    ],
                  },
                },
              },
            }),
          );
        });
      });
    });
  });

  await prisma.$transaction(async (prisma) => {
    await Promise.all([...prismaSets]); // TODO try without Promise.all
  });

  return { error: null };
};
