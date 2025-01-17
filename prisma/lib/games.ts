"use server";

import { unstable_cache } from "next/cache";
import prisma from "../db";
import { StatName } from "@prisma/client";
import { getSumOfStat } from "@prisma/client/sql";

// Cache is used for deduping
// unstable is used for time based caching
// perks of using this method is we can invalidate certain paths.

/**
 * Retrieves all games from the database.
 *
 * This function uses the `unstable_cache` to cache the results of the database query.
 * The cache is tagged with "getAllGames" and does not revalidate.
 *
 * @returns {Promise<Game[]>} A promise that resolves to an array of games.
 */
export const getAllGames = unstable_cache(
  async () => await prisma.game.findMany(),
  undefined,
  {
    tags: ["getAllGames"],
    revalidate: false,
  },
);

/**
 * Retrieves the sum of a specific statistic for a given player.
 *
 * @param playerId - The unique identifier of the player.
 * @param statName - The name of the statistic to sum.
 * @returns A promise that resolves to the sum of the specified statistic for the player.
 */
export const getSumPerStat = async (playerId: number, statName: StatName) =>
  await prisma.$queryRawTyped(getSumOfStat(playerId, statName));

/**
 * Retrieves the sets associated with a specific player in a game.
 *
 * @deprecated
 * @param {number} gameId - The unique identifier of the game.
 * @returns {Promise<Array>} A promise that resolves to an array of video sessions,
 * each containing the count of sets and their associated matches.
 */
export const getSetsPerPlayer = async (gameId: number) =>
  await prisma.session.findMany({
    where: { gameId },
    include: { sets: { select: { _count: true, matches: true } } },
  });

/**
 * Retrieves the wins per player for a given game.
 *
 * @param {number} gameId - The unique identifier of the game.
 * @returns {Promise<object | null>} A promise that resolves to an object containing the sessions and their respective match winners and set winners, or null if no game is found.
 */
export const getWinsPerPlayer = async (gameId: number) =>
  await prisma.game.findFirst({
    where: { gameId },
    select: {
      sessions: {
        select: {
          sessionName: true,
          sessionUrl: true,
          sets: {
            select: {
              matches: { select: { matchWinners: true } },
              setWinners: true,
            },
          },
        },
      },
    },
  });

/**
 * Retrieves matches per game based on the provided game ID and stat name. It is useful for calculating player stats per match.
 *
 * @template T - The type of the stat name, extending from `StatName`.
 * @param {number} gameId - The ID of the game to retrieve matches for.
 * @param {StatEndsWith<"POS", T>} statName - The stat name ending with "POS" to filter player stats.
 * @returns {Promise<Array>} A promise that resolves to an array of video sessions with nested sets, matches, and player sessions.
 */
export const getMatchesPerGame = async <T extends StatName = StatName>(
  gameId: number,
  statName: StatEndsWith<"POS", T>,
) =>
  await prisma.session.findMany({
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
                    select: { value: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

/**
 * Retrieves statistics for each player in a specific game. The statistics are filtered by the provided statistic name.
 *
 * @param gameId - The unique identifier of the game.
 * @param statName - The name of the statistic to retrieve.
 * @returns A promise that resolves to an array of player statistics, including the player and the value of the statistic.
 */
export const getStatPerPlayer = async (gameId: number, statName: StatName) =>
  await prisma.playerStat.findMany({
    where: { gameId, AND: { gameStat: { statName } } },
    select: { player: true, value: true },
  });

export type StatEndsWith<
  T extends string,
  Y extends StatName = StatName,
> = Y extends StatName ? (Y extends `${infer u}_${T}` ? Y : never) : never;
