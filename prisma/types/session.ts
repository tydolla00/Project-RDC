import { Prisma } from "@prisma/client";

const enrichedSession = Prisma.validator<Prisma.SessionDefaultArgs>()({
  include: {
    sets: {
      include: {
        matches: {
          include: {
            playerSessions: {
              include: {
                playerStats: true,
              },
            },
          },
        },
      },
    },
  },
});

export type EnrichedSession = Prisma.SessionGetPayload<typeof enrichedSession>;
