import { Player, PlayerSession, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedRDCMembers();
  await seedGames();
  await seedSession(1);

  const set1Results = [
    [1, 3, 2, 4, 5],
    [2, 3, 1, 4, 5],
    [2, 1, 4, 5, 3],
    [4, 2, 1, 3, 5],
  ];

  // Seed 1st set
  await seedSet(1, 1);
  // Simulate Race (Seed Match, PlayerSessions, PlayerStats)
  await simulateRace(1, 1, set1Results[0]);
  await simulateRace(1, 2, set1Results[1]);
  await simulateRace(1, 3, set1Results[2]);
  await simulateRace(1, 4, set1Results[3]);

  console.log("--- <> Seeded Mario Kart Session successfully <> ---");
  console.log("Seeds have been sown. o7");
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
  console.log("--- Seeding Games ---");
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

/**
 *
 * @param setId - setId of the set to seed
 * @param sessionId - sessionId of parent session of seeded set
 */
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

async function getStreamFive() {
  const mk8Players: Player[] = await prisma.player.findMany({
    where: {
      playerId: {
        in: [1, 2, 3, 4, 5],
      },
    },
  });
  return mk8Players;
}

async function simulateRace(
  setId: number,
  matchId: number,
  raceResults: number[] = [1, 2, 3, 4, 5],
) {
  const streamFive = await getStreamFive();
  // Create new match
  seedMatch(matchId, setId, streamFive, raceResults);
}

async function seedMatch(
  matchId: number,
  setId: number,
  playersInMatch: Player[],
  raceResults: number[],
) {
  const marioKartMatch = await prisma.match.upsert({
    where: { matchId: matchId },
    update: {},
    create: {
      matchId: matchId,
      setId: setId,
    },
  });

  // Should seed player sessions here
  seedPlayerSessions(matchId, playersInMatch, setId, raceResults);

  console.log(`Seeded Match ${matchId} Successfully.\n`);

  // Assign Match Winner
  const matchWinnerId = raceResults.indexOf(1) + 1;

  const matchWinner = await prisma.player.findFirst({
    where: {
      playerId: matchWinnerId,
    },
  });

  // Insert matchWinner into match
  if (matchWinner) {
    await prisma.match.update({
      where: { matchId: matchId },
      data: { matchWinner: { connect: { playerId: matchWinner.playerId } } },
    });
  }
}

async function seedPlayerSessions(
  matchId: number,
  players: Player[],
  setId: number,
  raceResults: number[],
) {
  // Create player sessions and attach to match
  // Every race there are n number of playerSessions created per player
  // so we need to offset the playerSessionId by the number of previous player sessions
  const playerSessionIdOffset = (setId - 1) * players.length;
  for (const player of players) {
    const playerSessionId = player.playerId + playerSessionIdOffset;
    const playerStatId = playerSessionId;

    const playerSession = await prisma.playerSession.upsert({
      where: { playerSessionId: player.playerId + playerSessionIdOffset },
      update: {},
      create: {
        playerSessionId: playerSessionId,
        matchId: matchId,
        sessionId: 1,
        setId: setId,
        playerId: player.playerId,
      },
    });

    const resultIndex = playerSession.playerId - 1; // Player ID is 1-indexed

    // Create player stats and attach to player sessions
    const playerResult = await seedPlayerStat(
      playerSession,
      1,
      raceResults[resultIndex],
    );
  }
}

async function seedPlayerStat(
  playerSession: PlayerSession,
  statId: number,
  statValue: number,
) {
  const newPlayerStatId = playerSession.playerSessionId;
  return await prisma.playerStat.upsert({
    where: { playerStatId: newPlayerStatId },
    update: {},
    create: {
      playerStatId: newPlayerStatId,
      playerId: playerSession.playerId,
      statId: statId,
      playerSessionId: playerSession.playerSessionId,
      gameId: 1,
      value: statValue.toString(),
      date: new Date(),
    },
  });
}

/**
 * Upsert player stat assuming playerStatID and playerSessionId are the same
 * @param idOffset - used to offset playerStatId and playerSessionId
 * @param positions - optional parameter to dictate positions (1-5) of players in the order of (Mark, Dyl, Ben, Lee, Des)
 * @param setId - optional parameter to identify set number player stats should belong too
 */
async function seedPlayerStats(
  idOffset: number = 0,
  positions: string[] = ["1", "2", "3", "4", "5"],
  setId: number = 1,
) {
  idOffset = idOffset * setId;

  // Seed PlayerStat for players (assume its the stream five)
  const markRace = await prisma.playerStat.upsert({
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

  const dylRace = await prisma.playerStat.upsert({
    where: { playerStatId: 2 + idOffset },
    update: {},
    create: {
      playerStatId: 2 + idOffset,
      playerId: 2,
      statId: 1, // MK_POS
      playerSessionId: 2 + idOffset,
      gameId: 1,
      value: positions[1],
      date: new Date(),
    },
  });

  const benRace = await prisma.playerStat.upsert({
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

  const leeRace = await prisma.playerStat.upsert({
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

  const desRace = await prisma.playerStat.upsert({
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

  console.log(`Finished creating player stats for set ${setId}`);
}
