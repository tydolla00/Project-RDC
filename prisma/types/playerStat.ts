import { Prisma } from "../generated";

const playerStatWithStatName = Prisma.validator<Prisma.PlayerStatDefaultArgs>()(
  {
    include: {
      gameStat: {
        select: {
          statName: true,
        },
      },
    },
  },
);

export type PlayerStatWithStatName = Prisma.PlayerStatGetPayload<
  typeof playerStatWithStatName
>;
