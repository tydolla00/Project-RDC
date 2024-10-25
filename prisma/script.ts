import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(await getMarioKartGameSession());
}

async function getAllRDCMembers() {
  const rdcMembers = await prisma.player.findMany();
  console.log("RDC Members: ", rdcMembers);
}

async function getMarioKartGameSession() {
  const gameSessions = await prisma.playerStat.findMany({
    where: {
      game: {
        gameId: 1,
      },
    },
    include: {
      player: true,
      game: true,
      gameStat: true,
    },
  });
  return gameSessions;
}

async function getPlayerStatsForGameSession(sessionId: number) {
  const playerStats = await prisma.gameSessionPlayer.findMany({
    where: {
      sessionId: sessionId,
    },
    include: {
      player: {
        include: {
          playerGameStats: {
            where: {
              gameId: sessionId, // Assuming gameId is the same as sessionId for simplicity
            },
            include: {
              game: true,
              gameStat: true,
            },
          },
        },
      },
      gameSession: true,
    },
  });

  return playerStats;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
