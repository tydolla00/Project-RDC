import { Player, PlayerSession } from "@prisma/client";
import prisma from "./db";
import { MembersEnum } from "@/lib/constants";
import { capitalizeFirst } from "@/lib/utils";

async function main() {
  console.group("Begin seeding Mario Kart Session");
  await seedRDCMembers();
  await seedGames();
  await seedSession(1);

  /**
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

  await updateSetWinner(1, [3]); // Ben Wins
  console.groupEnd();
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(process.exitCode || 0);
  });

// Seed RDC Members
async function seedRDCMembers() {
  console.log("--- Seeding RDC Members ---");

  const mark = await prisma.player.create({
    data: {
      playerId: 1,
      playerName: capitalizeFirst(MembersEnum.Mark),
    },
  });

  const aff = await prisma.player.create({
    data: {
      playerId: 2,
      playerName: capitalizeFirst(MembersEnum.Dylan),
    },
  });

  const des = await prisma.player.create({
    data: {
      playerId: 3,
      playerName: capitalizeFirst(MembersEnum.Ben),
    },
  });

  const ben = await prisma.player.create({
    data: {
      playerId: 4,
      playerName: capitalizeFirst(MembersEnum.Lee),
    },
  });

  const lee = await prisma.player.create({
    data: {
      playerId: 5,
      playerName: capitalizeFirst(MembersEnum.Des),
    },
  });

  const dylan = await prisma.player.create({
    data: {
      playerId: 6,
      playerName: capitalizeFirst(MembersEnum.John),
    },
  });

  const john = await prisma.player.create({
    data: {
      playerId: 7,
      playerName: capitalizeFirst(MembersEnum.Aff),
    },
  });

  const ipi = await prisma.player.create({
    data: {
      playerId: 8,
      playerName: capitalizeFirst(MembersEnum.Ipi),
    },
  });

  console.log("RDC Members Seeded Successfully.\n");
}

async function seedGames() {
  console.log("--- Seeding Games ---");
  const marioKart = await prisma.game.create({
    data: {
      gameName: "Mario Kart 8",
      gameStats: {
        create: [{ statName: "MK8_POS" }, { statName: "MK8_DAY" }],
      },
    },
  });

  const rocketLeague = await prisma.game.create({
    data: {
      gameName: "Rocket League",
      gameStats: {
        create: [
          { statName: "RL_SCORE" },
          { statName: "RL_GOALS" },
          { statName: "RL_ASSISTS" },
          { statName: "RL_SAVES" },
          { statName: "RL_SHOTS" },
          { statName: "RL_DAY" },
        ],
      },
    },
  });

  const callOfDuty = await prisma.game.create({
    data: {
      gameName: "Call of Duty",
      gameStats: {
        create: [
          { statName: "COD_SCORE" },
          { statName: "COD_KILLS" },
          { statName: "COD_DEATHS" },
          { statName: "COD_POS" },
        ],
      },
    },
  });
  const lethalCompany = await prisma.game.create({
    data: {
      gameName: "Lethal Company",
      gameStats: {
        create: [{ statName: "LC_DEATHS" }],
      },
    },
  });
  const speedRunners = await prisma.game.create({
    data: {
      gameName: "Speedrunners",
      gameStats: {
        create: [
          { statName: "SR_SETS" },
          { statName: "SR_WINS" },
          { statName: "SR_POS" },
        ],
      },
    },
  });

  console.log("Mario Kart Game Seeded.");
}

// Seed game session with RDC Stream Five
async function seedSession(sessionId: number) {
  console.log(`\n--- Seeding Game Session ${sessionId} ---`);

  const marioKartSession = await prisma.session.create({
    data: {
      gameId: 1,
      sessionName: "TEST MK8 SESSION YOU WON'T BELIEVE WHAT HAPPENS NEXT",
      sessionUrl: "https://example.com",
      thumbnail: "https://example.com/thumbnail.jpg",
      videoId: "example",
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
  const marioKartSet = await prisma.gameSet.create({
    data: {
      sessionId: sessionId,
    },
  });

  console.log(`Seeded Set ${setId} Successfully.\n`);
}

/**
 * Get the RDC Stream Five as an array of Players
 * @returns Player[] - Array of players in RDC Stream Five
 */
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

/**
 * Creates a match object and inserts into the set of setId
 * Note this currently only handles MK cases as it calculates the match winner assuming such!
 * @param matchId
 * @param setId
 * @param playersInMatch
 * @param raceResults
 *
 */
async function seedMatch(
  matchId: number,
  setId: number,
  playersInMatch: Player[],
  raceResults: number[],
) {
  const marioKartMatch = await prisma.match.create({
    data: {
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
      data: { matchWinners: { connect: { playerId: matchWinner.playerId } } },
    });
  }
}

/**
 * Inserts
 * @param matchId
 * @param players
 * @param setId
 * @param raceResults
 */
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
    console.log(`Seeding player session  for player: ${player.playerName}`);

    const playerSession = await prisma.playerSession.create({
      data: {
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
  return await prisma.playerStat.create({
    data: {
      playerId: playerSession.playerId,
      statId: statId,
      playerSessionId: playerSession.playerSessionId,
      gameId: 1,
      value: statValue.toString(),
      date: new Date(),
    },
  });
}

const updateSetWinner = async (setId: number, winnerIds: number[]) => {
  const setWinnerConnect = winnerIds.map((winnerId: number) => ({
    playerId: winnerId,
  }));

  if (setWinnerConnect) {
    await prisma.gameSet.update({
      where: { setId: setId },
      data: { setWinners: { connect: setWinnerConnect } },
    });
  }
};
