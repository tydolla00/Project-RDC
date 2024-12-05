import { MetadataRoute } from "next";
import { getAllGames } from "../../prisma/lib/games";
import { getAllMembers } from "../../prisma/lib/members";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [games, members] = await Promise.all([
    await getAllGames(),
    await getAllMembers(),
  ]);

  const gamesMeta: MetadataRoute.Sitemap = games.map((game) => ({
    url: `https://project-rdc.vercel.app/games/${game.gameName.replace(/\s/g, "").toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));

  const membersData: MetadataRoute.Sitemap = members.map((member) => ({
    url: `https://project-rdc.vercel.app/games/${member.playerName.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));

  return [
    {
      url: "https://project-rdc.vercel.app",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://project-rdc.vercel.app/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://project-rdc.vercel.app/games",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://project-rdc.vercel.app/members",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...gamesMeta,
    ...membersData,
  ];
}