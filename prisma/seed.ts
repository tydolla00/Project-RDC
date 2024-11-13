import { GameSet, Match, Player, PrismaClient } from "@prisma/client";
import { EnrichedSession } from "./types/session";
import { set } from "react-hook-form";

const prisma = new PrismaClient();

async function main() {
  // TODO: Seed player stats in seedPlayerSessions
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

  // // Seed 2nd set
  // await seedSet(2, 1);
  // await seedPlayerSessions(2);
  // await seedPlayerStats(20); // Races 5-8
  // await seedPlayerStats(25);
  // await seedPlayerStats(30, ["5", "3", "2", "4", "1"]);
  // await seedPlayerStats(35, ["4", "1", "3", "5", "2"]);

  // // Seed 3rd set
  // await seedSet(3, 1);
  // await seedPlayerSessions(3);
  // await seedPlayerStats(40); // Races 9-12
  // await seedPlayerStats(45, ["5", "2", "1", "4", "3"]);
  // await seedPlayerStats(50, ["4", "3", "1", "5", "2"]);
  // await seedPlayerStats(55);

  // // Seed 4th set
  // await seedSet(4, 1);
  // await seedPlayerSessions(4);
  // await seedPlayerStats(60, ["5", "4", "2", "3", "1"]); // Races 12-15
  // await seedPlayerStats(65);
  // await seedPlayerStats(50, ["5", "1", "2", "4", "3"]);
  // await seedPlayerStats(70, ["4", "1", "5", "3", "2"]);
  // await seedPlayerStats(75, ["1", "5", "2", "3", "4"]);

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
  const players = await getStreamFive();
  // Create new match
  seedMatch(matchId, setId);
}

async function seedMatch(matchId: number, setId: number, players: Player[]) {
  const marioKartMatch = await prisma.match.upsert({
    where: { matchId: matchId },
    update: {},
    create: {
      matchId: matchId,
      setId: setId,
    },
  });

  // Should seed player sessions here
  seedPlayerSessions(matchId, players, setId);

  console.log(`Seeded Match ${matchId} Successfully.\n`);
}

async function seedPlayerSessions(
  matchId: number,
  players: Player[],
  setId: number,
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

    // Create player stats and attach to player sessions
    const playerResult = await seedPlayerStat(raceResults);
  }

  // Simulates a race for a given set
  /**
   * @param setId - setId of the set to attach the match to
   * Every race there are n number of playerSessions created per player
   */

  // FOR NOW ASSUME NO TIES
  // const firstPlaceId = raceResults.indexOf(1) + 1;

  // const firstPlacePlayer = await prisma.player.findUnique({
  //   where: { playerId: firstPlaceId },
  // });

  // if (!firstPlacePlayer) {
  //   throw new Error(`1st Place Player with ID ${firstPlaceId} not found`);
  // }

  // // Set Match Winner
  // await prisma.match.update({
  //   where: { matchId: matchId },
  //   data: { matchWinner: { connect: { playerId: firstPlacePlayer.playerId } } },
  // });
}

async function seedPlayerStat(raceResults: number[]) {
  return await prisma.playerStat.upsert({
    where: { playerStatId: playerStatId },
    update: {},
    create: {
      playerStatId: playerStatId,
      playerId: player.playerId,
      statId: 1,
      playerSessionId: playerSessionId,
      gameId: 1,
      value: raceResults[player.playerId - 1].toString(),
      date: new Date(),
    },
  });
}

// Instead of creating playerSessions once per race manually, we should have a function that can create the playerSessions for the four races
/**
 * Create a batch of player sessions for a set number of games
 * @param numgames - number of games in set
 * @param players - array of players who participated in the set
 * @param set - GameSet type that will contain batched sessions
 * @param sessionId - Id of session that the set belongs too
 */
async function createPlayerSessionsBatch(
  numGames: number,
  players: Player[],
  set: GameSet,
  sessionId: number,
) {
  console.log("\n--- Creating Batch of Player Sessions for Set ---", set.setId);
  for (let game = 0; game < numGames; game++) {
    const matchId = (set.setId - 1) * game + 1;

    // Create new match
    await seedMatch(matchId, set.setId, players);
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
          matchId: matchId,
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
