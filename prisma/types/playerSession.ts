import { Prisma } from "@prisma/client";

// Things we need for each Mario Kart Session
// RDC names, stat names and values
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const playerSessionWithPlayerStats =
  Prisma.validator<Prisma.PlayerSessionDefaultArgs>()({
    include: {
      match: true,
      player: true,
      playerStats: true,
    },
  });

export type EnrichedPlayerSession = Prisma.PlayerSessionGetPayload<
  typeof playerSessionWithPlayerStats
>;
