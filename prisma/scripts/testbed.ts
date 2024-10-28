import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.player.findFirst({
    include: {
      playerStats: true,
    },
  });
  // console.log(user);

  const player = await prisma.player.findFirst({
    include: {
      playerSessions: {
        include: {
          session: {
            select: {
              sessionName: true,
            },
          },
        },
      },
    },
  });

  // Get All Session Names for a Player
  const sessionNames = player?.playerSessions.map(
    (playerSessions) => playerSessions.session.sessionName,
  );
  // console.log(sessionNames);
  console.log(await getSessionWithPlayersAndStats(1));
}

// Query to get a single session including all players and their stats
async function getSessionWithPlayersAndStats(sessionId: number) {
  const sessionData = await prisma.session.findUnique({
    where: { sessionId: sessionId },
    include: {
      playerSessions: {
        include: {
          playerStats: {
            select: {
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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
