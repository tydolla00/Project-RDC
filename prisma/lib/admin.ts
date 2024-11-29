import prisma from "../db";
// Should only do this once in the EntryCreator I think
export const getRDCMembers = async () => {
  const members = await prisma.player.findMany();

  return members;
};
