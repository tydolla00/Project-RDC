import prisma from "../db";
import { unstable_cache } from "next/cache";

export const getAllMembers = unstable_cache(
  async () => {
    return await prisma.player.findMany();
  },
  undefined,
  { tags: ["allMembers"], revalidate: false },
);
