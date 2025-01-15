"use server";

import { unstable_cache } from "next/cache";
import prisma from "../db";
import { StatName } from "@prisma/client";
import { getSumOfStat } from "@prisma/client/sql";

// Cache is used for deduping
// unstable is used for time based caching
// perks of using this method is we can invalidate certain paths.
/**
 * Fetches all games from the database.
 * @returns all game records including gameName and gameId
 */
export const getAllGames = unstable_cache(
  async () => await prisma.game.findMany(),
  undefined,
  {
    tags: ["getAllGames"],
  },
);

export const getSumPerStat = async (playerId: number, statName: StatName) =>
  await prisma.$queryRawTyped(getSumOfStat(playerId, statName));
/**
 * Fetches all sets pertaining to a game from the database.
 * @param gameId id of the game record
 * @returns Data about a game's sets.
 * @deprecated
 */
export const getSetsPerPlayer = async (gameId: number) =>
  await prisma.videoSession.findMany({
    where: { gameId },
    include: { sets: { select: { _count: true, matches: true } } },
  });

/**
 * Fetches all records for a game including info about the winners of the session, set, and match.
 * @param gameId id of the game record
 * @returns all records for a game
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
 * Fetches all sessions for a game and includes the player sessions and matches. Useful for calculating info per match/session.
 * @param gameId id of the game record
 * @param statName StatName of the stat you are checking for, must end in _POS for now.
 * @returns all player records with a given StatName
 */
export const getMatchesPerGame = async <T extends StatName = StatName>(
  gameId: number,
  statName: StatEndsWith<"POS", T>,
) =>
  await prisma.videoSession.findMany({
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
 * Fetches all player records for a game for a given statname.
 * @param gameId id of the game record
 * @param statName Statname of the stat you are checking for.
 * @returns Array of play records
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
