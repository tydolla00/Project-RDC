"use server";

import { unstable_cache } from "next/cache";
import prisma, { handlePrismaOperation, QueryResponse } from "../db";
import { StatName } from "@prisma/client";
import { getSumOfStat } from "@prisma/client/sql";

export type StatEndsWith<
  T extends string,
  Y extends StatName = StatName,
> = Y extends StatName ? (Y extends `${infer u}_${T}` ? Y : never) : never;

// Cache is used for deduping
// unstable is used for time based caching
// perks of using this method is we can invalidate certain paths.

/**
 * Retrieves all games from the database, using cache for deduplication.
 *
 * @returns Promise resolving to an array of games.
 */
export const getAllGames = unstable_cache(
  async () => await handlePrismaOperation(() => prisma.game.findMany()),
  undefined,
  {
    tags: ["getAllGames"],
    revalidate: false,
  },
);

export const getGame = async (gameName: string) =>
  await handlePrismaOperation(() =>
    prisma.game.findFirst({
      where: { gameName },
    }),
  );

/**
 * Retrieves the sum of a specific statistic for a given player.
 *
 * @param playerId - The unique identifier of the player.
 * @param statName - The name of the statistic to sum.
 * @returns A promise that resolves to the sum of the specified statistic for the player.
 */
export const getSumPerStat = async (playerId: number, statName: StatName) =>
  await handlePrismaOperation(() =>
    prisma.$queryRawTyped(getSumOfStat(playerId, statName)),
  );

/**
 * Retrieves the sets associated with a specific player in a game.
 *
 * @deprecated
 * @param {number} gameId - The unique identifier of the game.
 * @returns {Promise<Array>} A promise that resolves to an array of video sessions,
 * each containing the count of sets and their associated matches.
 */
export const getSetsPerPlayer = async (gameId: number) =>
  await handlePrismaOperation(() =>
    prisma.session.findMany({
      where: { gameId },
      include: { sets: { select: { _count: true, matches: true } } },
    }),
  );

/**
 * Retrieves the wins per player for a given game.
 *
 * @param {number} gameId - The unique identifier of the game.
 * @returns {Promise<object | null>} A promise that resolves to an object containing the sessions and their respective match winners and set winners, or null if no game is found.
 */
export const getWinsPerPlayer = async (gameId: number) =>
  await handlePrismaOperation(() =>
    prisma.game.findFirst({
      where: { gameId },
      select: {
        sessions: {
          select: {
            sessionId: true,
            sessionName: true,
            sessionUrl: true,
            sets: {
              select: {
                setId: true,
                matches: { select: { matchId: true, matchWinners: true } },
                setWinners: true,
              },
            },
          },
        },
      },
    }),
  );

/**
 * Retrieves matches per game for a given game ID and stat name (ending with 'POS').
 * Useful for calculating player stats per match.
 *
 * @template T - Stat name type
 * @param gameId - Game ID
 * @param statName - Stat name ending with 'POS'
 * @returns Promise resolving to an array of sessions with nested sets, matches, and player sessions.
 */
export const getMatchesPerGame = async <T extends StatName = StatName>(
  gameId: number,
  statName: StatEndsWith<"POS", T>,
) =>
  await handlePrismaOperation(() =>
    prisma.session.findMany({
      where: { gameId },
      select: {
        sets: {
          select: {
            setWinners: true,
            matches: {
              select: {
                matchWinners: true,
                date: true,
                playerSessions: {
                  select: {
                    player: true,
                    playerStats: {
                      where: { gameStat: { statName } },
                      select: { playerStatId: true, value: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
  );

/**
 * Retrieves statistics for each player in a specific game, filtered by stat name.
 *
 * @param gameId - Game ID
 * @param statName - Stat name to filter
 * @returns Promise resolving to an array of player statistics.
 */
export const getStatPerPlayer = async (gameId: number, statName: StatName) =>
  await handlePrismaOperation(() =>
    prisma.playerStat.findMany({
      where: { gameId, AND: { gameStat: { statName } } },
      select: { player: true, value: true, statId: true },
    }),
  );

/**
 * Retrieves all game stats from the database.
 *
 * @returns Promise resolving to an array of game stats.
 */
export const getAllGameStats = async () =>
  await handlePrismaOperation(() =>
    prisma.gameStat.findMany({
      select: { statName: true, statId: true },
    }),
  );
