"use server";

import { GameStat } from "@prisma/client";
import prisma, { handlePrismaOperation } from "../../../prisma/db";
import { FormValues } from "../(routes)/admin/_utils/form-helpers";
import { auth } from "@/auth";
import { errorCodes } from "@/lib/constants";
import { revalidateTag } from "next/cache";
import { logFormError, logFormSuccess } from "@/posthog/server-analytics";
import { after } from "next/server";

export async function approveSession(sessionId: number) {
  try {
    const query = await handlePrismaOperation(() =>
      prisma.session.update({
        where: { sessionId },
        data: { isApproved: true },
        select: { sessionId: true },
      }),
    );

    if (!query.success) {
      return { error: query.error || "Failed to approve session" };
    }

    revalidateTag("getAllSessions");
    return { success: true };
  } catch (error) {
    console.error("Error approving session:", error);
    return { error: "Failed to approve session" };
  }
}

/**
 * Retrieves the statistics for a specified game.
 *
 * @param {string} gameName - The name of the game to retrieve statistics for.
 * @returns {Promise<GameStat[]>} A promise that resolves to an array of game statistics.
 * @throws {Error} If the game with the specified name is not found.
 * @returns {Promise<GameStat[]>} Returns an empty array if the game is not found.
 * @throws {Error} If the game statistics cannot be retrieved.
 */
export async function getGameStats(gameName: string): Promise<GameStat[]> {
  console.log("Looking for gameStats for ", gameName);
  const game = await handlePrismaOperation(() =>
    prisma.game.findFirst({ where: { gameName } }),
  );

  if (!game.success || !game.data) return [];

  const gameId = game.data.gameId;
  const gameStats = await handlePrismaOperation(() =>
    prisma.gameStat.findMany({
      where: {
        gameId: gameId,
      },
    }),
  );

  if (!gameStats.success || !gameStats.data) {
    throw new Error("Stats not found.");
  }
  return gameStats.data;
}

export async function getGameIdFromName(gameName: string) {
  const game = await prisma.game.findFirst({
    where: {
      gameName: gameName,
    },
  });

  if (!game) {
    throw new Error(`Game with name ${gameName} not found`);
  }

  return game.gameId;
}

/**
 * Inserts a new session from the admin form.
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
 *               playerStats: [{ stat: "RL_SCORE", statValue: 100 }],
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
 */
export const insertNewSessionFromAdmin = async (
  session: FormValues,
): Promise<{ error: null | string }> => {
  console.group("insertNewSessionFromAdmin");
  console.log("Inserting New Session: ", session);

  const user = await auth();
  let error: null | string = null;

  try {
    if (!user) return { error: errorCodes.NotAuthenticated };

    const sessionGame = await prisma.game.findFirst({
      where: { gameName: session.game },
    });

    if (!sessionGame) return { error: "Game not found." };
    else {
      const videoAlreadyExists = await prisma.session.findFirst({
        where: {
          gameId: sessionGame.gameId,
          AND: { videoId: session.videoId },
        },
      });

      console.log(videoAlreadyExists);

      if (videoAlreadyExists) return { error: "Video already exists." };
    }

    // Pre-fetch all gameStats for this game and build a lookup map
    const allGameStats = await prisma.gameStat.findMany({
      where: { gameId: sessionGame.gameId },
    });
    const gameStatMap = new Map(allGameStats.map((gs) => [gs.statName, gs]));

    await prisma.$transaction(async (prismaTx) => {
      const newSession = await prismaTx.session.create({
        data: {
          gameId: sessionGame.gameId,
          sessionName: session.sessionName,
          sessionUrl: session.sessionUrl,
          thumbnail: session.thumbnail,
          date: session.date,
          videoId: session.videoId,
          createdBy: user.user?.email || "SYSTEM",
        },
      });
      const newSessionId = newSession.sessionId;
      console.log("New session ID: ", newSessionId);

      // For each set in the session assign to parent session
      await Promise.all(
        session.sets.map(async (set, i) => {
          console.log(
            "\n-- Creating Set From Admin Form Submission:  -- \n",
            set,
          );

          const setWinnerConnect = (set?.setWinners ?? []).map((winner) => ({
            playerId: winner.playerId,
          }));

          console.log(`Set Winners for set ${i + 1}: `, setWinnerConnect);

          const newSet = await prismaTx.gameSet.create({
            data: { sessionId: newSessionId },
          });

          console.log("New Set ID: ", newSet.setId);

          await prismaTx.gameSet.update({
            where: { setId: newSet.setId },
            data: { setWinners: { connect: setWinnerConnect } },
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

              const newMatch = await prismaTx.match.create({
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

                  const playerSessionPlayer = await prismaTx.player.findUnique({
                    where: {
                      playerId: playerSession.playerId,
                    },
                  });

                  if (!playerSessionPlayer)
                    throw new Error(
                      `Player not found: ${playerSession.playerId}`,
                    );

                  console.log(
                    `Values to be inserted into newPlayerSession: PlayerId: ${playerSession.playerId}, SessionId: ${newSessionId}, MatchId: ${newMatch.matchId}, SetId: ${newSet.setId}`,
                  );

                  const newPlayerSession = await prismaTx.playerSession.create({
                    data: {
                      playerId: playerSession.playerId,
                      sessionId: newSessionId,
                      matchId: newMatch.matchId,
                      setId: newSet.setId,
                    },
                  });

                  console.log("New PlayerSession Created: ", newPlayerSession);

                  // For each playerStat in playerSession assign to parent playerSession
                  // Collect all playerStats to bulk insert
                  const playerStatsToCreate = await Promise.all(
                    playerSession.playerStats.map(async (playerStat) => {
                      console.log(
                        "Creating PlayerStat From Admin Form Submission: ",
                        playerStat,
                      );

                      let gameStat: GameStat | undefined = gameStatMap.get(
                        playerStat.stat,
                      );
                      if (!gameStat) {
                        // fallback to DB lookup if not found (shouldn't happen)
                        gameStat =
                          (await prismaTx.gameStat.findFirst({
                            where: {
                              statName: playerStat.stat,
                              gameId: sessionGame.gameId,
                            },
                          })) || undefined;
                        if (gameStat)
                          gameStatMap.set(playerStat.stat, gameStat);
                      }

                      // If gameStat is still not found, throw an error
                      // If gameStat is still not found, throw an error
                      if (!gameStat)
                        throw new Error(
                          `GameStat not found: ${playerStat.stat}`,
                        );
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

                      return {
                        playerId: newPlayerSession.playerId,
                        gameId: sessionGame!.gameId,
                        playerSessionId: newPlayerSession.playerSessionId,
                        statId: gameStat!.statId,
                        value: playerStat.statValue,
                        date: sessionDate,
                      };
                    }),
                  );
                  // Bulk insert all playerStats for this playerSession
                  if (playerStatsToCreate.length > 0)
                    await prismaTx.playerStat.createMany({
                      data: playerStatsToCreate,
                    });
                }),
              );
            }),
          );
        }),
      );
    });
    after(() => logFormSuccess(user));
    revalidateTag("getAllSessions");
    return { error: null };
  } catch (err) {
    after(() => logFormError(err, session));
    error = "Unknown error occurred. Please try again.";
    return { error };
  } finally {
    console.groupEnd();
  }
};

export const revalidateAction = async (path: string) => revalidateTag(path);
