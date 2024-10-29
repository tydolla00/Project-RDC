import { Prisma } from "@prisma/client";

// Things we need for each Mario Kart Session
// RDC names, stat names and values
const playerSessionWithPlayerStats =
  Prisma.validator<Prisma.PlayerSessionDefaultArgs>()({
    include: {
      player: {
        select: {
          playerName: true,
        },
      },
      playerStats: {
        include: {
          gameStat: true,
        },
      },
    },
  });

export type PlayerSessionWithStats = Prisma.PlayerSessionGetPayload<
  typeof playerSessionWithPlayerStats
>;
