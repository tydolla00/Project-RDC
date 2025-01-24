import prisma from "../db";

async function main() {
  console.log(await getAllTimeMKRankings());
}

async function getAllTimeMKRankings() {
  const playerStats = await prisma.playerStat.findMany({
    where: {
      gameId: 1,
      statId: 1,
    },
    include: {
      player: true,
      game: true,
      gameStat: true,
      playerSession: true,
    },
  });

  console.log("Player Stats", playerStats);
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
