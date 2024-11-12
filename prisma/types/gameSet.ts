import { Prisma } from "@prisma/client";

const enrichedGameSet = Prisma.validator<Prisma.GameSetDefaultArgs>()({
  include: {
    matches: {
      include: {
        playerSessions: {
          include: {
            playerStats: true,
            player: {
              select: {
                playerName: true,
              },
            },
          },
        },
      },
    },
  },
});

export type EnrichedGameSet = Prisma.GameSetGetPayload<typeof enrichedGameSet>;
