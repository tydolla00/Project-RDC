import { Prisma } from "../generated";

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
  namespace PrismaJson {
    type MvpOutput = {
      statName: string;
      sum: number;
      average?: number | undefined;
    }[];
  }
}
