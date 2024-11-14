import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { StatNames } from "./utils";

const prisma = new PrismaClient();

// Cache is used for deduping
// unstable is used for time based caching
// perks of using this method is we can invalidate certain paths.
export const getAllGames = unstable_cache(
  async () => await prisma.game.findMany(),
  undefined,
  { tags: ["getAllGames"], revalidate: false },
);

// May want to refactor to only take the winner. Right now includes all data about each set.
export const getSetsPerPlayer = unstable_cache(
  async (gameId: number) =>
    await prisma.session.findMany({
      where: { gameId },
      include: { sets: { select: { _count: true, matches: true } } },
    }),
  undefined,
  { tags: ["getSetsPerPlayer"], revalidate: false },
);

export const getDaysPerPlayer = unstable_cache(
  async (gameId: number, statName: StatNames) =>
    await prisma.gameStat.findFirst({
      where: { statName, gameId },
      select: { playerStats: { select: { value: true, player: true } } },
    }),
  undefined,
  { tags: ["getDaysPerPlayer"], revalidate: false },
);

// also used as getSetsPerPlayer
export const getWinsPerPlayer = unstable_cache(
  async (gameId: number) =>
    await prisma.game.findFirst({
      where: { gameId },
      select: {
        sessions: {
          select: {
            sessionName: true,
            sessionUrl: true,
            sets: {
              select: {
                matches: { select: { matchWinner: true } },
                setWinner: true,
              },
            },
          },
        },
      },
    }),
  undefined,
  { tags: ["getWinsPerPlayer"] },
);

/**
 * A function that can be used to calculate position stats, Most 1st, Most Last, Average Placing, etc.
 * Works for Mario Kart, COD Gun Game.
 */
export const getPositionStatsPerPlayer = unstable_cache(
  async <T extends StatNames = StatNames>(
    gameId: number,
    statName: StatNameValues<T>,
    utils?: Parameters<PrismaClient["playerStat"]["findMany"]>[0],
  ) =>
    await prisma.playerStat.findMany({
      where: { gameId, AND: { gameStat: { statName } } },
      select: { player: true, value: true },
    }),
  undefined,
  { tags: ["getPositionStatsPerPlayer"] },
);

type StatNameValues<T extends StatNames> = T extends StatNames
  ? T extends `${infer u}_POS`
    ? `${u}_POS`
    : never
  : never;
