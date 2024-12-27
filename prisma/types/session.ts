import { Prisma } from "@prisma/client";

const enrichedSession = Prisma.validator<Prisma.VideoSessionDefaultArgs>()({
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

export type EnrichedSession = Prisma.VideoSessionGetPayload<
  typeof enrichedSession
>;
