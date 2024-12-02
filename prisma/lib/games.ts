import { unstable_cache } from "next/cache";
import { StatNames } from "./utils";
import prisma from "../db";

// ! Tags takes an array of tags if you invalidate a tag any method with that tag will also be invalidated.
// ! So I need to figure out in which scenarios do I want to invalidate only a function or a whole game.

// Cache is used for deduping
// unstable is used for time based caching
// perks of using this method is we can invalidate certain paths.
/**
 * Fetches all games from the database.
 * @returns all game records including gameName and gameId
 */
export const getAllGames = function () {
  return unstable_cache(async () => await prisma.game.findMany(), undefined, {
    tags: ["getAllGames"],
    revalidate: false,
  })();
};

/**
 * Fetches all sets pertaining to a game from the database.
 * @param gameId id of the game record
 * @returns Data about a game's sets.
 * @deprecated
 */
export const getSetsPerPlayer = function (gameId: number) {
  return unstable_cache(
    async () =>
      await prisma.session.findMany({
        where: { gameId },
        include: { sets: { select: { _count: true, matches: true } } },
      }),
    undefined,
    { tags: ["getSetsPerPlayer", gameId.toString()], revalidate: false },
  )();
};

/**
 * Fetches all records from the database involving players who have the Day stat
 * @param gameId id of the game record
 * @param statName Statname, must end in _DAY
 * @returns all player records and value with the statName.
 */
export const getDaysPerPlayer = function <T extends StatNames = StatNames>(
  gameId: number,
  statName: StatNameValues<T, "DAY">,
) {
  return unstable_cache(
    async () =>
      await prisma.gameStat.findFirst({
        where: { statName, gameId },
        select: { playerStats: { select: { value: true, player: true } } },
      }),
    undefined,
    { tags: ["getDaysPerPlayer", gameId.toString()], revalidate: false },
  )();
};

// also used as getSetsPerPlayer
/**
 * Fetches all records for a game including info about the session, set, and match.
 * @param gameId id of the game record
 * @returns all records for a game
 */
export const getWinsPerPlayer = function (gameId: number) {
  return unstable_cache(
    async () =>
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
      }),
    undefined,
    { tags: ["getWinsPerPlayer", gameId.toString()], revalidate: false },
  )();
};

/**
 * Fetches all records for players given a gameId. Fetches based off position or score.
 * @param gameId id of the game record
 * @param statName Statname, must end in _POS or _SCORE
 * @returns all player records with position stats
 */
export const getScoreStatsPerPlayer = function <
  T extends StatNames = StatNames,
>(
  gameId: number,
  statName: StatNameValues<T, "POS"> | StatNameValues<T, "SCORE">,
) {
  return unstable_cache(
    async () =>
      await prisma.playerStat.findMany({
        where: { gameId, AND: { gameStat: { statName } } },
        select: { player: true, value: true },
      }),
    undefined,
    {
      tags: ["getPositionStatsPerPlayer", gameId.toString()],
      revalidate: false,
    },
  )();
};

/**
 * Fetches all sessions for a game and includes the playersessions and matches. Useful for calculating info per match/session.
 * @param gameId id of the game record
 * @param statName Statname of the stat you are checking for, muste end in _POS for now.
 * @returns all player records with a given statname
 */
export const getMatchesPerGame = function <T extends StatNames = StatNames>(
  gameId: number,
  statName: StatNameValues<T, "POS">,
) {
  return unstable_cache(
    async () =>
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
      }),
    undefined,
    {
      tags: ["getMatchesPerGame", gameId.toString()],
      revalidate: false,
    },
  )();
};

/**
 * Fetches all player records for a game for a given statname.
 * @param gameId id of the game record
 * @param statName Statname of the stat you are checking for.
 * @returns Array of play records
 */
export const getStatPerPlayer = function (gameId: number, statName: StatNames) {
  return unstable_cache(
    async () =>
      await prisma.playerStat.findMany({
        where: { gameId, AND: { gameStat: { statName } } },
        select: { player: true, value: true },
      }),
    undefined,
    { tags: ["getStatPerPlayer", gameId.toString()] },
  )();
};

export type StatNameValues<
  T extends StatNames,
  Y extends string,
> = T extends StatNames
  ? T extends `${infer u}_${Y}`
    ? `${u}_${Y}`
    : never
  : never;
