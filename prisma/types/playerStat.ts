import { Prisma } from "@prisma/client";

export const playerStatWithStatName =
  Prisma.validator<Prisma.PlayerStatDefaultArgs>()({
    include: {
      gameStat: {
        select: {
          statName: true,
        },
      },
    },
  });

export type PlayerStatWithStatName = Prisma.PlayerStatGetPayload<
  typeof playerStatWithStatName
>;
