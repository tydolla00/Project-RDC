import { PrismaClient } from "@prisma/client";
import { PlayerSessionWithStats } from "../types/playerSession";

const prisma = new PrismaClient();

async function main() {
  console.log(await getLatestMarioKartSession());
}

// Query to get a single session including all players and their stats
async function getSessionWithPlayersAndStats(sessionId: number) {
  const sessionData = await prisma.session.findUnique({
    where: { sessionId: sessionId },
    include: {
      playerSessions: {
        include: {
          playerStats: {
            include: {
              gameStat: true,
            },
          },
        },
      },
    },
  });

  const sessionStats = sessionData?.playerSessions.map((playerSession) => {
    console.log(
      "Player Session ID: ",
      playerSession.playerSessionId,
      "Stats: ",
      playerSession.playerStats[0],
    );
  });

  console.log("Session Stats: ", sessionStats);

  return sessionData;
}

async function getLatestMarioKartSession() {
  try {
    const latestMKPlayerSessions = await prisma.session.findFirst({
      where: {
        gameId: 1,
      },
      orderBy: {
        sessionId: "desc",
      },
      include: {
        sets: true,
        playerSessions: {
          include: {
            player: {
              select: {
                playerName: true,
              },
            },
            playerStats: {
              include: {
                gameStat: true,
              },
            },
          },
        },
      },
    });
    // console.log("Found Latest Mario Kart Session: ", latestMKPlayerSessions);
    if (latestMKPlayerSessions) {
      parseMarioKartPlayerSessions(latestMKPlayerSessions.playerSessions);
    } else {
      console.error("Latest Mario Kart Session not found");
    }
  } catch (error) {
    console.error("Error Fetching Latest Mario Kart Session");
  }
}

async function parseMarioKartPlayerSessions(
  playerSessions: PlayerSessionWithStats[],
) {
  playerSessions.forEach((playerSession) => {
    console.log("Player Session ", playerSession);

    playerSession.playerStats.forEach((playerStat) => {
      console.log("Game Stat: ", playerStat.gameStat.statName);
    });
  });
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
