import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedRDCMembers();
  await seedGames();
  await seedSession(1);

  // Seed 1st set
  await seedSet();
  await seedPlayerSessions(1);
  await seedPlayerStats(); // Seed Player Stats for Race 1
  await seedPlayerStats(5, ["2", "3", "1", "4", "5"]); // Seed Player Stats for Race 2
  await seedPlayerStats(10, ["3", "2", "4", "5", "1"]); // Seed Player Stats for Race 3
  await seedPlayerStats(15); // Seed Player Stats for Race 4
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

async function seedSet(sessionId: number = 1) {
  const marioKartSet = await prisma.gameSet.upsert({
    where: { setId: 1 },
    update: {},
    create: {
      setId: 1,
      sessionId: sessionId,
    },
  });

  console.log("Seeded Set");
}

// TODO: This should take the set id?
async function seedPlayerSessions(setId: number) {
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
      `Creating Player Session for Player: ${player.playerId} -> Set ${setId}`,
    );
    await prisma.playerSession.upsert({
      where: { playerSessionId: player.playerId },
      update: {},
      create: {
        playerSessionId: player.playerId,
        sessionId: 1,
        setId: setId,
        playerId: player.playerId,
      },
    });
  }

  // Second MK8 Race (5 Player Sessions)
  for (let i = 0; i < 5; i++) {
    const player = mk8Players[i];
    console.log(
      `Creating Player Session for Player: ${player.playerId} -> Session ${setId}`,
    );
    await prisma.playerSession.upsert({
      where: { playerSessionId: player.playerId + 5 }, // Second session Jump = +5
      update: {},
      create: {
        playerSessionId: player.playerId + 5, // Second session Jump = +5
        sessionId: 1,
        setId: 1,
        playerId: player.playerId,
      },
    });
  }

  // Third MK8 Race
  for (let i = 0; i < 5; i++) {
    const player = mk8Players[i];
    console.log(
      `Creating Player Session for Player: ${player.playerId} -> Session ${setId}`,
    );
    await prisma.playerSession.upsert({
      where: { playerSessionId: player.playerId + 10 }, // Third session Jump = +10
      update: {},
      create: {
        playerSessionId: player.playerId + 10, // Third session Jump = +10
        sessionId: 1,
        setId: 1,
        playerId: player.playerId,
      },
    });
  }

  // Fourth MK8 Race
  for (let i = 0; i < 5; i++) {
    const player = mk8Players[i];
    console.log(
      `Creating Player Session for Player: ${player.playerId} -> Session ${setId}`,
    );
    await prisma.playerSession.upsert({
      where: { playerSessionId: player.playerId + 15 }, // Fourth session Jump = +15
      update: {},
      create: {
        playerSessionId: player.playerId + 15, // Fourth session Jump = +15
        sessionId: 1,
        setId: 1,
        playerId: player.playerId,
      },
    });
  }
}

// Instead of creating playerSessions once per race manually, we should have a function that can create the playerSessions for the four races
/**
 *
 * @param idOffset - used to offset playerSessionId
 */
async function createPlayerSessionsBatch(idOffset: number) {}

/**
 * Upsert player stat assuming playerStatID and playerSessionId are the same
 * @param idOffset - used to offset playerStatId and playerSessionId
 */
async function seedPlayerStats(
  idOffset: number = 0,
  positions: string[] = ["1", "2", "3", "4", "5"],
) {
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
      value: positions[0],
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
      value: positions[1],
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
      value: positions[2],
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
      value: positions[3],
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
      value: positions[4],
      date: new Date(),
    },
  });
}
