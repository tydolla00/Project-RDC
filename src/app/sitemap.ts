import { MetadataRoute } from "next";
import { getAllGames } from "../../prisma/lib/games";
import { getAllMembers } from "../../prisma/lib/members";

/**
 * Generates a sitemap for the Project-RDC application.
 *
 * This function fetches all games and members data, then constructs a sitemap
 * with URLs for the main pages, games, and members. Each URL entry includes
 * metadata such as the last modified date, change frequency, and priority.
 *
 * @returns {Promise<MetadataRoute.Sitemap>} A promise that resolves to the sitemap.
 *
 * @example
 * const sitemap = await sitemap();
 * console.log(sitemap);
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = "https://project-rdc.vercel.app";
  const [games, members] = await Promise.all([
    await getAllGames(),
    await getAllMembers(),
  ]);

  if (!games.success || !games.data) games.data = [];
  if (!members.success || !members.data) members.data = [];

  const gamesMeta: MetadataRoute.Sitemap = games.data.map((game) => ({
    url: `${BASE_URL}/games/${game.gameName.replace(/\s/g, "").toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));

  const membersData: MetadataRoute.Sitemap = members.data.map((member) => ({
    url: `${BASE_URL}/members/${member.playerName.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/members`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...gamesMeta,
    ...membersData,
  ];
}
