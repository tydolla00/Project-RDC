import { PlayerSession, PrismaClient, Session, Prisma } from "@prisma/client";
import { parse } from "path";

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
      include: {
        playerSessions: {
          include: {
            playerStats: true,
          },
        },
      },
    });
    console.log("Found Latest Mario Kart Session: ", latestMKPlayerSessions);
    if (latestMKPlayerSessions) {
      parseMarioKartPlayerSessions(latestMKPlayerSessions.playerSessions);
    } else {
      console.error("Latest Mario Kart Session not found");
    }
  } catch (error) {
    console.error("Error Fetching Latest Mario Kart Session");
  }
}

const playerSessionWithStats =
  Prisma.validator<Prisma.PlayerSessionDefaultArgs>()({
    include: {
      playerStats: true,
    },
  });

async function parseMarioKartPlayerSessions(playerSessions: PlayerSession[]) {
  playerSessions.forEach((playerSession) => {
    console.log(`Player Session: ${JSON.stringify(playerSession, null, 2)}`);
  });
}

// async function parseMarioKartSessionResults(sessionData: PlayerSession[]) {
//   for (const playerSession of sessionData) {
//     console.log("Player Session: ", playerSession);

//     const sessionStats = playerSession.playerStats.map((playerStat) => {
//       console.log("Player Stat: ", playerStat);
//     }
//   }
// }

// Replace 'Session' with the actual model name from your schema.prisma
// Make sure to import the model from "@prisma/client"

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
