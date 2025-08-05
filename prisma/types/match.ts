import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
