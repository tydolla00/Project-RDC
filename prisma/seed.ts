import { Player, PlayerSession, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedRDCMembers();
  await seedGames();
  await seedSession(1);

  /**
   * If you reaaaallllyy want to real data...
   * Here is where you would put in match results. Each list is
   * a match and the index is the playerId -1
   * e.g Ben's results are all index 2
   */
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

  await updateSetWinner(1);
}

main()
  .then(async () => {
    await prisma.$disconnect();

    console.log("<> ---  Seeded Mario Kart Session successfully  --- <>");
    console.log("Seeds have been sown. o7");
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

  const rocketLeague = await prisma.game.upsert({
    where: { gameId: 2 },
    update: {},
    create: {
      gameName: "Rocket League",
    },
  });

  const callOfDuty = await prisma.game.upsert({
    where: { gameId: 3 },
    update: {},
    create: {
      gameName: "Call of Duty",
    },
  });
  const lethalCompany = await prisma.game.upsert({
    where: { gameId: 4 },
    update: {},
    create: {
      gameName: "Lethal Company",
    },
  });
  const speedRunners = await prisma.game.upsert({
    where: { gameId: 5 },
    update: {},
    create: {
      gameName: "Speedrunners",
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
      thumbnail: "https://example.com/thumbnail.jpg",
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
  await seedMatch(matchId, setId, streamFive, raceResults);
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
  await seedPlayerSessions(matchId, playersInMatch, setId, raceResults);

  console.log(`Seeded Match ${matchId} Successfully.\n`);

  // Assign Match Winner
  const matchWinnerId = raceResults.indexOf(1) + 1;

  const matchWinner = await prisma.player.findFirst({
    where: {
      playerId: matchWinnerId,
    },
  });

  // Update match with match winner
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
  const playerSessionIdOffset = (matchId - 1) * players.length;
  for (const player of players) {
    const newPlayerSessionId = player.playerId + playerSessionIdOffset;

    console.log(
      `Seeding player session ${newPlayerSessionId} for player: ${player.playerName}`,
    );

    const playerSession = await prisma.playerSession.upsert({
      where: { playerSessionId: newPlayerSessionId },
      update: {},
      create: {
        playerSessionId: newPlayerSessionId,
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

const getSetWinner = async (setId: number) => {
  const setMatches = await prisma.match.findMany({
    where: {
      setId: setId,
    },
    include: {
      matchWinner: true,
    },
  });

  // console.log(`Set matches ${setMatches}`);

  // TODO: Refactor this to be cleaner O_O
  const matchWinners = setMatches
    .filter((match) => match.matchWinner)
    .map((match) => ({
      playerId: match.matchWinner[0].playerId,
      playerName: match.matchWinner[0].playerName,
    }));

  const winnerCount: { [playerId: number]: number } = {};

  matchWinners.forEach((winner) => {
    if (winnerCount[winner.playerId]) {
      winnerCount[winner.playerId]++;
    } else {
      winnerCount[winner.playerId] = 1;
    }
  });

  const maxWins = Math.max(...Object.values(winnerCount));
  const setWinner = Object.keys(winnerCount).find(
    (playerId) => winnerCount[Number(playerId)] === maxWins,
  );

  const setWinnerPlayer = matchWinners.find(
    (winner) => winner.playerId === Number(setWinner),
  );

  console.log(`Set ${setId} Winner: ${setWinnerPlayer?.playerName}`);

  return setWinnerPlayer;
};

const updateSetWinner = async (setId: number) => {
  const setWinner = await getSetWinner(setId);
  if (setWinner) {
    await prisma.gameSet.update({
      where: { setId: setId },
      data: { setWinner: { connect: { playerId: setWinner.playerId } } },
    });
  }
};
