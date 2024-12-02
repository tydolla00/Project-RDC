import { Prisma } from "@prisma/client";

const enrichedMatch = Prisma.validator<Prisma.MatchArgs>()({
  include: {
    playerSessions: {
      include: {
        player: true,
        playerStats: true,
      },
    },
  },
});

export type EnrichedMatch = Prisma.MatchGetPayload<typeof enrichedMatch>;
