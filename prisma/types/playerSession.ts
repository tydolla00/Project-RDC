import { Prisma } from "@prisma/client";

// Things we need for each Mario Kart Session
// RDC names, stat names and values
const playerSessionWithPlayerStats =
  Prisma.validator<Prisma.PlayerSessionDefaultArgs>()({
    include: {
      match: true,
      player: {
        select: {
          playerName: true,
        },
      },
      playerStats: true,
    },
  });

export type PlayerSessionWithStats = Prisma.PlayerSessionGetPayload<
  typeof playerSessionWithPlayerStats
>;
