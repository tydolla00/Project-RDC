import { Prisma } from "../generated";

// Things we need for each Mario Kart Session
// RDC names, stat names and values

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
