import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Inserting dummy data...");

  // Insert Players
  await prisma.player.createMany({
    data: [
      { playerId: 1, playerName: "Alice" },
      { playerId: 2, playerName: "Bob" },
    ],
  });

  // Insert Game
  await prisma.game.create({
    data: {
      gameId: 1,
      gameName: "Mario Kart",
    },
  });

  // Insert Game Stats
  await prisma.gameStat.createMany({
    data: [
      {
        statId: 1,
        gameId: 1,
        statName: "Laps Completed",
        statValue: "3",
        date: new Date("2023-10-01"),
      },
      {
        statId: 2,
        gameId: 1,
        statName: "Time Taken",
        statValue: "5 minutes",
        date: new Date("2023-10-01"),
      },
      {
        statId: 3,
        gameId: 1,
        statName: "Position",
        statValue: "1st",
        date: new Date("2023-10-01"),
      },
    ],
  });

  // Insert Game Session
  await prisma.gameSession.create({
    data: {
      sessionId: 1,
      gameId: 1,
    },
  });

  // Insert Game Session Players
  await prisma.gameSessionPlayer.createMany({
    data: [
      { gameSessionPlayerId: 1, sessionId: 1, playerId: 1 },
      { gameSessionPlayerId: 2, sessionId: 1, playerId: 2 },
    ],
  });

  // Insert Player Stats
  await prisma.playerStat.createMany({
    data: [
      {
        playerGameStatId: 1,
        playerId: 1,
        gameId: 1,
        statId: 1,
        value: "3",
        datePlayed: new Date("2023-10-01"),
      },
      {
        playerGameStatId: 2,
        playerId: 1,
        gameId: 1,
        statId: 2,
        value: "5 minutes",
        datePlayed: new Date("2023-10-01"),
      },
      {
        playerGameStatId: 3,
        playerId: 1,
        gameId: 1,
        statId: 3,
        value: "1st",
        datePlayed: new Date("2023-10-01"),
      },
      {
        playerGameStatId: 4,
        playerId: 2,
        gameId: 1,
        statId: 1,
        value: "3",
        datePlayed: new Date("2023-10-01"),
      },
      {
        playerGameStatId: 5,
        playerId: 2,
        gameId: 1,
        statId: 2,
        value: "5 minutes 30 seconds",
        datePlayed: new Date("2023-10-01"),
      },
      {
        playerGameStatId: 6,
        playerId: 2,
        gameId: 1,
        statId: 3,
        value: "2nd",
        datePlayed: new Date("2023-10-01"),
      },
    ],
  });

  console.log("Dummy data inserted.");

  const playerStats = await getPlayerStatsForGameSession(1);
  console.log(
    "Player Stats for Game Session 1:",
    JSON.stringify(playerStats, null, 2),
  );
}

async function getAllRDCMembers() {
  const rdcMembers = await prisma.player.findMany();
  console.log("RDC MEmbers: ", rdcMembers);
}

async function getMarioKartGameSession() {
  const gameSessions = await prisma.playerStat.findMany({
    where: {
      game: {
        gameId: 1,
      },
    },
    include: {
      player: true,
      game: true,
      gameStat: true,
    },
  });

  return gameSessions;
}

async function getPlayerStatsForGameSession(sessionId: number) {
  const playerStats = await prisma.gameSessionPlayer.findMany({
    where: {
      sessionId: sessionId,
    },
    include: {
      player: {
        include: {
          playerGameStats: {
            where: {
              gameId: sessionId, // Assuming gameId is the same as sessionId for simplicity
            },
            include: {
              game: true,
              gameStat: true,
            },
          },
        },
      },
      gameSession: true,
    },
  });

  return playerStats;
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
