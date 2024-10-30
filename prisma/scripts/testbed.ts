import { PrismaClient } from "@prisma/client";
import { EnrichedSession } from "../types/session";

const prisma = new PrismaClient();

async function main() {
  console.log(await getLatestMarioKartSession());
}

/// Fetched Enriched Mario Kart Session
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
    if (latestMKPlayerSessions != null) {
      console.log(
        "Latest Mario Kart Session: ",
        showSetStatsByPlayerByRace([latestMKPlayerSessions]),
      );
    }
  } catch (error) {
    console.error("Error Fetching Latest Mario Kart Session");
  }
}

async function showSetStatsByPlayer(mkSession: EnrichedSession[]) {
  // Print Stats For A Set By Player
  for (const session of mkSession) {
    for (const set of session.sets) {
      console.log(`--- Set ${set.setId} ---`);
      for (const playerSession of set.playerSessions) {
        console.log(`\nPlayer: ${playerSession.player.playerName}`);
        for (const playerStat of playerSession.playerStats) {
          console.log(`Stat: ${playerStat.statId} Value: ${playerStat.value}`);
        }
      }
    }
  }
}

async function showSetStatsByPlayerByRace(mkSession: EnrichedSession[]) {
  // Group Stats For A Set By Player
  for (const session of mkSession) {
    for (const set of session.sets) {
      console.log(`--- Set ${set.setId} ---`);
      const playerStatsMap: { [playerName: string]: string[] } = {};

      for (const playerSession of set.playerSessions) {
        const playerName = playerSession.player.playerName;
        if (!playerStatsMap[playerName]) {
          playerStatsMap[playerName] = [];
        }
        for (const playerStat of playerSession.playerStats) {
          playerStatsMap[playerName].push(playerStat.value);
        }
      }

      for (const playerName in playerStatsMap) {
        console.log(`\nPlayer: ${playerName}`);
        console.log(`Placements: ${playerStatsMap[playerName].join(", ")}`);
      }
    }
  }
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
