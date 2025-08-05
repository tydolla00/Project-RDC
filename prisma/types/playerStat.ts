import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
