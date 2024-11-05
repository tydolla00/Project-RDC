import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

const prisma = new PrismaClient();

// Cache is used for deduping
// unstable is used for time based caching
// perks of using this method is we can invalidate certain paths.
export const getAllGames = unstable_cache(
  async () => {
    return await prisma.game.findMany();
  },
  undefined,
  { tags: ["allGames"], revalidate: false },
);
