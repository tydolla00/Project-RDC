import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

export const getAllMembers = unstable_cache(
  async () => {
    return await prisma.player.findMany();
  },
  undefined,
  { tags: ["allMembers"], revalidate: false },
);
