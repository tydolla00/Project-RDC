import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const player = await prisma.player.create({
    data: {
      player_id: 1,
      player_name: "Mark",
    },
  });
  console.log(player);
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
