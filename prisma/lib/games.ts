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
  async (gameId: number) =>
    await prisma.gameStat.findFirst({
      where: { statName: StatNames.MarioKartDays, gameId },
      select: { playerStats: { select: { value: true, player: true } } },
    }),
  undefined,
  { tags: ["getDaysPerPlayer"], revalidate: false },
);

// I want to get the video where the game is MK8 and the gameStat is MK_POS and include the matches so I can calculate the winsPerPlayer
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
