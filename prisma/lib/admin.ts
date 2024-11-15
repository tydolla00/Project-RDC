import { PrismaClient } from "@prisma/client";

// Should only do this once in the EntryCreator I think
export const getRDCMembers = async () => {
  const prisma = new PrismaClient();
  const members = await prisma.player.findMany();

  return members;
};

export const fetchGameStats = async (gameId: number) => {
  const prisma = new PrismaClient();
  const gameStats = await prisma.gameStat.findMany({
    where: {
      gameId: gameId,
    },
  });

  return gameStats;
};
