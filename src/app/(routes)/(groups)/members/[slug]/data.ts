import prisma, { handlePrismaOperation } from "@/../prisma/db";
import { cache } from "react";

export const getMember = cache(async (slug: string) => {
  const member = await handlePrismaOperation(() => prisma.player.findFirst({
    where: {
      playerName: {
        equals: slug,
        mode: "insensitive",
      },
    },
    include: {
      matchWins: true,
      setWins: true,
      dayWins: true,
      playerStats: {
        include: {
          game: true,
          gameStat: true,
        },
      },
      playerSessions: {
        include: {
          playerStats: true,
        },
      },
    },
  }));

  return member;
});
