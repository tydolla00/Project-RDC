import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Ahhh!");
  const gameSessions = await getMarioKartGameSession();
  console.log("Mario Kart Game Sessions: ", gameSessions);
}

async function getAllRDCMembers() {
  const rdcMembers = await prisma.player.findMany();
  console.log("RDC MEmbers: ", rdcMembers);
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
