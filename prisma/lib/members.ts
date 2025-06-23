import prisma, { handlePrismaOperation } from "../db";
import { unstable_cache } from "next/cache";

/**
 * Retrieves all members from the database.
 *
 * This function uses the `unstable_cache` to cache the results of the database query.
 * The cache is tagged with "allMembers" and does not revalidate.
 *
 * @returns {Promise<Array<Player>>} A promise that resolves to an array of player objects.
 */
export const getAllMembers = unstable_cache(
  async () => await handlePrismaOperation(() => prisma.player.findMany()),
  undefined,
  { tags: ["allMembers"], revalidate: false },
);
