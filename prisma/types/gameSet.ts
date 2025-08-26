import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
