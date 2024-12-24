import { Prisma } from "@prisma/client";

const enrichedMatch = Prisma.validator<Prisma.Match$matchWinnersArgs>()({
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
