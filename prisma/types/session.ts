import { Prisma } from "@prisma/client";

const enrichedSession = Prisma.validator<Prisma.SessionDefaultArgs>()({
  include: {
    sets: {
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
    },
  },
});

export type EnrichedSession = Prisma.SessionGetPayload<typeof enrichedSession>;
