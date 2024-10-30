import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedRDCMembers();
  await seedGames();
  await seedSession(1);
  await seedSet();
  await seedPlayerSessions(1);
  await seedPlayerStats();
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
  console.log("--- Seeding RDC Members --\n");
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
  console.log("---Seeding Games---\n");
  const marioKart = await prisma.game.upsert({
    where: { gameId: 1 },
    update: {},
    create: {
      gameName: "Mario Kart",
      gameStats: {
        create: [
          {
            statId: 1,
            statName: "MK8_FIRST",
            statValue: "",
            date: new Date(),
          },
          {
            statId: 2,
            statName: "MK8_SECOND",
            statValue: "",
          },
          {
            statId: 3,
            statName: "MK8_THIRD",
            statValue: "",
          },
          {
            statId: 4,
            statName: "MK8_FOURTH",
            statValue: "",
          },
          {
            statId: 5,
            statName: "MK8_FIFTH",
            statValue: "",
          },
        ],
      },
    },
  });
  console.log("Mario Kart Game Seeded");

  const callOfDuty = await prisma.game.upsert({
    where: { gameId: 2 },
    update: {},
    create: {
      gameId: 2,
      gameName: "Call of Duty",
    },
  });

  console.log("Call of Duty Game Seeded");

  const gangBeasts = await prisma.game.upsert({
    where: { gameId: 3 },
    update: {},
    create: {
      gameId: 3,
      gameName: "Gang Beasts",
    },
  });

  console.log("Gang Beasts Game Seeded");
}

// Seed game session with RDC Stream Five
async function seedSession(sessionId: number) {
  console.log(`Seeding Game Session ${sessionId}`);
  const marioKartSession = await prisma.session.upsert({
    where: { sessionId: sessionId },
    update: {},
    create: {
      sessionId: sessionId,
      gameId: 1,
      sessionName: "TEST MK8 SESSION YOU WON'T BELIEVE WHAT HAPPENS NEXT",
      sessionUrl: "https://example.com",
    },
  });
}

async function seedSet() {
  const marioKartSet = await prisma.set.upsert({
    where: { setId: 1 },
    update: {},
    create: {
      setId: 1,
      sessionId: 1,
    },
  });

  console.log("Seeded Set");
}

async function seedPlayerSessions(sessionId: number) {
  const playerIds = await prisma.player.findMany({
    select: { playerId: true },
  });

  for (const player of playerIds) {
    console.log(`Connecting player to session ${sessionId}`, player.playerId);
    await prisma.playerSession.upsert({
      where: { playerSessionId: player.playerId },
      update: {},
      create: {
        playerSessionId: player.playerId,
        sessionId: sessionId,
        setId: 1,
        playerId: player.playerId,
      },
    });
  }
}
async function seedPlayerStats() {
  // Seed PlayerStat for Mark
  const markFirst = await prisma.playerStat.upsert({
    where: { playerStatId: 1 },
    update: {},
    create: {
      playerStatId: 1,
      playerId: 1,
      statId: 1, // MK_FIRST
      playerSessionId: 1,
      gameId: 1,
      value: "1",
      date: new Date(),
    },
  });

  const dylSecond = await prisma.playerStat.upsert({
    where: { playerStatId: 2 },
    update: {},
    create: {
      playerStatId: 2,
      playerId: 6,
      statId: 2, // MK_SECOND
      playerSessionId: 2,
      gameId: 1,
      value: "1",
      date: new Date(),
    },
  });

  const benThird = await prisma.playerStat.upsert({
    where: { playerStatId: 3 },
    update: {},
    create: {
      playerStatId: 3,
      playerId: 4,
      statId: 3, // MK_THIRD
      playerSessionId: 3,
      gameId: 1,
      value: "1",
      date: new Date(),
    },
  });

  const leeFourth = await prisma.playerStat.upsert({
    where: { playerStatId: 4 },
    update: {},
    create: {
      playerStatId: 4,
      playerId: 5,
      statId: 4, // MK_FOURTH
      playerSessionId: 4,
      gameId: 1,
      value: "1",
      date: new Date(),
    },
  });

  const desFifth = await prisma.playerStat.upsert({
    where: { playerStatId: 5 },
    update: {},
    create: {
      playerStatId: 5,
      playerId: 3,
      statId: 5, // MK_FIFTH
      playerSessionId: 5,
      gameId: 1,
      value: "1",
      date: new Date(),
    },
  });
}
