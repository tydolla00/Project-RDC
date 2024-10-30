import { Prisma } from "@prisma/client";

const enrichedGameSet = Prisma.validator<Prisma.GameSetDefaultArgs>()({
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

export type EnrichedGameSet = Prisma.GameSetGetPayload<typeof enrichedGameSet>;
