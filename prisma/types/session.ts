import { Prisma } from "@prisma/client";

const enrichedSession = Prisma.validator<Prisma.SessionDefaultArgs>()({
  include: {
    Game: true,
    sets: {
      include: {
        setWinners: true,
        matches: {
          include: {
            matchWinners: true,
            playerSessions: {
              include: {
                player: true,
                playerStats: { include: { gameStat: true } },
              },
            },
          },
        },
      },
    },
  },
});

export type EnrichedSession = Prisma.SessionGetPayload<typeof enrichedSession>;
