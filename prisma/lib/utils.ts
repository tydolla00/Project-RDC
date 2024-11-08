import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query"] });

/**
 *
 * @param gameId id in game table
 * @returns
 */
export const getSetsPerPlayer = async (gameId: number) =>
  await prisma.session.findMany({
    where: { gameId },
    select: { sets: { where: {} } },
  });

export const getDaysPerPlayer = async (playerId: string) => {};
