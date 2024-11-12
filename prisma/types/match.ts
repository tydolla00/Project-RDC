import { Prisma } from "@prisma/client";

const enrichedMatch = Prisma.validator<Prisma.MatchArgs>()({
  include: {
    playerSessions: {
      include: {
        player: {
          select: {
            playerName: true,
          },
        },
        playerStats: true,
      },
    },
  },
});

export type EnrichedMatch = Prisma.MatchGetPayload<typeof enrichedMatch>;
