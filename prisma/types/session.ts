import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const enrichedSession = Prisma.validator<Prisma.SessionDefaultArgs>()({
  include: {
    Game: true,
    mvp: true,
    dayWinners: true,
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type MvpOutput = {
      statName: string;
      sum: number;
      average?: number | undefined;
    }[];
  }
}
