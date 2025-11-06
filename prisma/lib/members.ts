import { findPlayer } from "@/app/(routes)/admin/_utils/player-mappings";
import { handlePrismaOperation } from "../db";
import { cacheLife } from "next/cache";
import "server-only";

/**
 * Retrieves all members from the database.
 *
 * This function uses the `unstable_cache` to cache the results of the database query.
 * The cache is tagged with "allMembers" and does not revalidate.
 *
 * @returns {Promise<Array<Player>>} A promise that resolves to an array of player objects.
 */
export const getAllMembers = async () => {
  "use cache";
  cacheLife("max");
  return await handlePrismaOperation((prisma) => prisma.player.findMany());
};

/**
 * Returns navigation data for all RDC members.
 *
 * @returns Promise resolving to an array of member navigation objects.
 */
export const getMembersNav = async () => {
  const members = await getAllMembers();

  if (!members.success || !members.data) return [];

  const navMembers: {
    alt: string;
    name: string;
    navName: string;
    url: string;
    src: string;
    desc: string;
    stats: { prop: string; val: string }[];
  }[] = members.data.map((member) => {
    const rdcMember = findPlayer(member.playerName) ?? undefined;
    return {
      alt: rdcMember?.nav?.alt ?? member.playerName,
      name: member.playerName,
      navName: rdcMember?.nav?.name ?? member.playerName,
      url: rdcMember?.nav?.url ?? `/members/${member.playerName.toLowerCase()}`,
      src: rdcMember?.nav?.src ?? "",
      desc: rdcMember?.desc ?? "",
      stats: rdcMember?.stats ?? [],
    };
  });
  return navMembers;
};
