import { GameSet, Player, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedRDCMembers();
  await seedGames();
  await seedSession(1);

  // Seed 1st set
  await seedSet(1, 1);
  await seedPlayerSessions(1);
  await seedPlayerStats(); // Seed Player Stats for Race 1
  await seedPlayerStats(5, ["2", "3", "1", "4", "5"]); // Seed Player Stats for Race 2
  await seedPlayerStats(10, ["3", "2", "4", "5", "1"]); // Seed Player Stats for Race 3
  await seedPlayerStats(15); // Seed Player Stats for Race 4

  // Seed 2nd set
  await seedSet(2, 1);
  await seedPlayerSessions(2);
  await seedPlayerStats(20); // Races 5-8
  await seedPlayerStats(25);
  await seedPlayerStats(30, ["5", "3", "2", "4", "1"]);
  await seedPlayerStats(35, ["4", "1", "3", "5", "2"]);

  // Seed 3rd set
  await seedSet(3, 1);
  await seedPlayerSessions(3);
  await seedPlayerStats(40); // Races 9-12
  await seedPlayerStats(45, ["5", "2", "1", "4", "3"]);
  await seedPlayerStats(50, ["4", "3", "1", "5", "2"]);
  await seedPlayerStats(55);

  // Seed 4th set
  await seedSet(4, 1);
  await seedPlayerSessions(4);
  await seedPlayerStats(60, ["5", "4", "2", "3", "1"]); // Races 12-15
  await seedPlayerStats(65);
  await seedPlayerStats(50, ["5", "1", "2", "4", "3"]);
  await seedPlayerStats(70, ["4", "1", "5", "3", "2"]);
  await seedPlayerStats(75, ["1", "5", "2", "3", "4"]);
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
  console.log("--- Seeding RDC Members ---");
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

  const ben = await prisma.player.upsert({
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

  console.log("RDC Members Seeded Successfully.\n");
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

async function seedSet(setId: number, sessionId: number = 1) {
  const marioKartSet = await prisma.gameSet.upsert({
    where: { setId: setId },
    update: {},
    create: {
      setId: setId,
      sessionId: sessionId,
    },
  });

  console.log(`Seeded Set ${setId} Successfully.\n`);
}

// TODO: This should take the set id?
async function seedPlayerSessions(setId: number) {
  const mk8Players: Player[] = await prisma.player.findMany({
    where: {
      playerId: {
        in: [1, 2, 3, 4, 5],
      },
    },
  });

  const mk8Session = await prisma.session.findFirst({
    where: {
      gameId: 1,
    },
    include: {
      sets: {
        include: {
          playerSessions: {
            include: {
              player: {
                select: {
                  playerName: true,
                },
              },
              playerStats: true,
            },
          },
        },
      },
    },
  });

  if (!mk8Session) {
    throw new Error("Session not found");
  }

  console.log("Mario Kart Players:", mk8Players);

  await createPlayerSessionsBatch(
    4,
    mk8Players,
    mk8Session.sets[setId - 1], // Need to find better way to pass in set here
    mk8Session.sessionId,
  );
}

// Instead of creating playerSessions once per race manually, we should have a function that can create the playerSessions for the four races
/**
 *
 * @param idOffset - used to offset playerSessionId
 */
async function createPlayerSessionsBatch(
  numOfGames: number,
  players: Player[],
  set: GameSet,
  sessionId: number,
) {
  console.log("\n--- Creating Batch of Player Sessions for Set ---", set.setId);
  // console.log("Players:", players);
  for (let game = 0; game < numOfGames; game++) {
    const setModifier = (set.setId - 1) * 20; // Every set assume there are 5 players * 4 races = 20 player sessions
    const idOffset = game * 5 + setModifier;

    // Creating Player Sessions per Race
    console.log(`\nCreating Sessions for Race ${game}`);
    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      await prisma.playerSession.upsert({
        where: { playerSessionId: player.playerId + idOffset },
        update: {},
        create: {
          playerSessionId: player.playerId + idOffset,
          sessionId: sessionId,
          setId: set.setId,
          playerId: player.playerId,
        },
      });
      console.log(
        `Created Player Session ${player.playerId + idOffset} for Player: ${player.playerName}`,
      );
    }
  }
}

/**
 * Upsert player stat assuming playerStatID and playerSessionId are the same
 * @param idOffset - used to offset playerStatId and playerSessionId
 */
async function seedPlayerStats(
  idOffset: number = 0,
  positions: string[] = ["1", "2", "3", "4", "5"],
  setNumber: number = 1,
) {
  idOffset = idOffset * setNumber;
  console.log(`Id Offset In Player Stats ${idOffset}\n`);
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
