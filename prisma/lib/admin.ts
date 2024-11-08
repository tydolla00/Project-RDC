import { PrismaClient } from "@prisma/client";

// Should only do this once in the EntryCreator I think
export const getRDCMembers = async () => {
  const prisma = new PrismaClient();
  const members = await prisma.player.findMany();

  return members;
};
