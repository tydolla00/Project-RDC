import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedRDCMembers();
  await seedGames();
  await seedSession(1);
  await seedSet();
  await seedPlayerSessions(1);
  await seedPlayerStats();
  await seedPlayerStats(5);
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
      playerName: "Dylan",
    },
  });

  const des = await prisma.player.upsert({
    where: { playerId: 3 },
    update: {},
    create: {
      playerId: 3,
      playerName: "Ben",
    },
  });

  const Ben = await prisma.player.upsert({
    where: { playerId: 4 },
    update: {},
    create: {
      playerId: 4,
      playerName: "Lee",
    },
  });
  const lee = await prisma.player.upsert({
    where: { playerId: 5 },
    update: {},
    create: {
      playerId: 5,
      playerName: "Des",
    },
  });

  const dylan = await prisma.player.upsert({
    where: { playerId: 6 },
    update: {},
    create: {
      playerId: 6,
      playerName: "John",
    },
  });

  const john = await prisma.player.upsert({
    where: { playerId: 7 },
    update: {},
    create: {
      playerId: 7,
      playerName: "Aff",
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
  console.log("---Seeding Games---");
  const marioKart = await prisma.game.upsert({
    where: { gameId: 1 },
    update: {},
    create: {
      gameName: "Mario Kart",
      gameStats: {
        create: [
          {
            statId: 1,
            statName: "MK8_POS",
            date: new Date(),
          },
        ],
      },
    },
  });
  console.log("Mario Kart Game Seeded.");
}

// Seed game session with RDC Stream Five
async function seedSession(sessionId: number) {
  console.log(`\n--- Seeding Game Session ${sessionId} ---`);
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
  console.log("Seeded MK8 Session Successfully.\n");
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
  const mk8Players = await prisma.player.findMany({
    where: {
      playerId: {
        in: [1, 2, 3, 4, 5],
      },
    },
  });

  console.log("Mario Kart Players:", mk8Players);

  // First MK8 Set
  for (let i = 0; i < 5; i++) {
    const player = mk8Players[i];
    console.log(
      `Creating Player Session for Player: ${player.playerId} -> Session ${sessionId}`,
    );
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

  // Second MK8 Set
  for (let i = 0; i < 5; i++) {
    const player = mk8Players[i];
    console.log(
      `Creating Player Session for Player: ${player.playerId} -> Session ${sessionId}`,
    );
    await prisma.playerSession.upsert({
      where: { playerSessionId: player.playerId + 5 }, // Second session Jump = +5
      update: {},
      create: {
        playerSessionId: player.playerId + 5, // Second session Jump = +5
        sessionId: sessionId,
        setId: 1,
        playerId: player.playerId,
      },
    });
  }
}
/**
 * Seed Player Stats
 * @param idOffset - used to offset playerStatId and playerSessionId
 */
async function seedPlayerStats(idOffset: number = 0) {
  // Seed PlayerStat for Mark
  const markFirst = await prisma.playerStat.upsert({
    where: { playerStatId: 1 + idOffset },
    update: {},
    create: {
      playerStatId: 1 + idOffset,
      playerId: 1,
      statId: 1, // MK_POS
      playerSessionId: 1 + idOffset,
      gameId: 1,
      value: "1",
      date: new Date(),
    },
  });

  const dylSecond = await prisma.playerStat.upsert({
    where: { playerStatId: 2 + idOffset },
    update: {},
    create: {
      playerStatId: 2 + idOffset,
      playerId: 6,
      statId: 1, // MK_POS
      playerSessionId: 2 + idOffset,
      gameId: 1,
      value: "2",
      date: new Date(),
    },
  });

  const benThird = await prisma.playerStat.upsert({
    where: { playerStatId: 3 + idOffset },
    update: {},
    create: {
      playerStatId: 3 + idOffset,
      playerId: 4,
      statId: 1, // MK_POS
      playerSessionId: 3 + idOffset,
      gameId: 1,
      value: "3",
      date: new Date(),
    },
  });

  const leeFourth = await prisma.playerStat.upsert({
    where: { playerStatId: 4 + idOffset },
    update: {},
    create: {
      playerStatId: 4 + idOffset,
      playerId: 5,
      statId: 1, // MK_POS
      playerSessionId: 4 + idOffset,
      gameId: 1,
      value: "4",
      date: new Date(),
    },
  });

  const desFifth = await prisma.playerStat.upsert({
    where: { playerStatId: 5 + idOffset },
    update: {},
    create: {
      playerStatId: 5 + idOffset,
      playerId: 3,
      statId: 1, // MK_POS
      playerSessionId: 5 + idOffset,
      gameId: 1,
      value: "5",
      date: new Date(),
    },
  });
}
