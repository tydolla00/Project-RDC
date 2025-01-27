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

/**
 * Retrieves all sessions associated with a specific game.
 *
 * @param gameId - The unique identifier of the game.
 * @returns A promise that resolves to an array of session objects, each including the game name.
 *
 * @remarks
 * This function uses the `unstable_cache` to cache the results for 1 week (604800 seconds).
 * The cache is tagged with "getAllSessions".
 *
 * @example
 * ```typescript
 * const sessions = await getAllSessionsByGame(1);
 * console.log(sessions);
 * ```
 */
export const getAllSessionsByGame = unstable_cache(
  async (gameId: number) =>
    await prisma.session.findMany({
      where: { gameId },
      include: { Game: { select: { gameName: true } } },
    }),
  undefined,
  { revalidate: 604800, tags: ["getAllSessions"] }, // 1 week
);
