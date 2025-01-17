import { unstable_cache } from "next/cache";
import prisma from "../db";

/**
 * Retrieves all video sessions from the database, including the associated game names.
 *
 * This function uses `unstable_cache` to cache the results for 1 week (604800 seconds).
 * The cache is tagged with "getAllSessions" for easy invalidation.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of video sessions with game names.
 */
export const getAllSessions = unstable_cache(
  async () =>
    await prisma.session.findMany({
      include: { Game: { select: { gameName: true } } },
    }),
  undefined,
  { revalidate: 604800, tags: ["getAllSessions"] }, // 1 week
);
