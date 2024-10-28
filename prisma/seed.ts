import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedRDCMembers();
  await seedGameSession(1);

  console.log("Seeded RDC Members and Games");
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

// Seed RDC Members
async function seedRDCMembers() {
  const mark = await prisma.player.upsert({
    where: { playerId: 1 },
    update: {},
    create: {
      playerId: 1,
      playerName: "Mark",
    },
  });

  const aff = await prisma.player.upsert({
    where: { playerId: 2 },
    update: {},
    create: {
      playerId: 2,
      playerName: "Aff",
    },
  });

  const des = await prisma.player.upsert({
    where: { playerId: 3 },
    update: {},
    create: {
      playerId: 3,
      playerName: "Des",
    },
  });

  const Ben = await prisma.player.upsert({
    where: { playerId: 4 },
    update: {},
    create: {
      playerId: 4,
      playerName: "Ben",
    },
  });
  const lee = await prisma.player.upsert({
    where: { playerId: 5 },
    update: {},
    create: {
      playerId: 5,
      playerName: "Lee",
    },
  });

  const dylan = await prisma.player.upsert({
    where: { playerId: 6 },
    update: {},
    create: {
      playerId: 6,
      playerName: "Dylan",
    },
  });

  const john = await prisma.player.upsert({
    where: { playerId: 7 },
    update: {},
    create: {
      playerId: 7,
      playerName: "John",
    },
  });

  const ippi = await prisma.player.upsert({
    where: { playerId: 8 },
    update: {},
    create: {
      playerId: 8,
      playerName: "Ippi",
    },
  });
}

async function seedGames() {
  const marioKart = await prisma.game.upsert({
    where: { gameId: 1 },
    update: {},
    create: {
      gameName: "Mario Kart",
      gameStats: {
        create: [
          {
            statId: 1,
            statName: "First",
            statValue: "",
          },
          {
            statId: 2,
            statName: "Second",
            statValue: "",
          },
          {
            statId: 3,
            statName: "Third",
            statValue: "",
          },
          {
            statId: 4,
            statName: "Fourth",
            statValue: "",
          },
          {
            statId: 5,
            statName: "Fifth",
            statValue: "",
          },
        ],
      },
    },
  });

  const callOfDuty = await prisma.game.upsert({
    where: { gameId: 2 },
    update: {},
    create: {
      gameId: 2,
      gameName: "Call of Duty",
    },
  });

  const gangBeasts = await prisma.game.upsert({
    where: { gameId: 3 },
    update: {},
    create: {
      gameId: 3,
      gameName: "Gang Beasts",
    },
  });
}

// Seed game session with RDC Stream Five
async function seedGameSession(sessionId: number) {
  console.log(`Seeding Game Session ${sessionId}`);
  const marioKartSession = await prisma.session.upsert({
    where: { sessionId: sessionId },
    update: {},
    create: {
      sessionId: sessionId,
      gameId: 1,
      sessionName: "TEST MK8 SESSION YOU WON'T BELIEVE WHAT HAPPENS NEXT",
      sessionUrl: "https://example.com",
      players: {
        connect: [
          { sessionPlayerId: 1 },
          { sessionPlayerId: 3 },
          { sessionPlayerId: 4 },
          { sessionPlayerId: 5 },
          { sessionPlayerId: 6 },
        ],
      },
    },
  });

  const playerIds = await prisma.player.findMany({
    select: { playerId: true },
  });

  for (const player of playerIds) {
    console.log(`Connecting player to session ${sessionId}`, player.playerId);
    await prisma.sessionPlayer.create({
      data: {
        playerId: player.playerId,
        sessionId: sessionId,
      },
    });
  }

  // // Seed Session Players
  // const mark = await prisma.sessionPlayer.upsert({
  //   where: { sessionPlayerId: 1 },
  //   update: {},
  //   create: {
  //     sessionPlayerId: 1,
  //     playerId: 1,
  //     sessionId: 1,
  //   },
  // });

  // Seed PlayerStat for Mark
  const markFirst = await prisma.playerStat.upsert({
    where: { playerStatId: 1 },
    update: {},
    create: {
      playerStatId: 1,
      playerId: 1,
      statId: 1,
      sessionId: 1,
      gameId: 1,
      value: "1",
      datePlayed: new Date(),
    },
  });
}
