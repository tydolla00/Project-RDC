import { Prisma } from "../generated";

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
