import { PlayerSession, PrismaClient } from "@prisma/client";
import { EnrichedSession } from "../types/session";
const prisma = new PrismaClient();

// --- Priorities ---

// Get latest MK8 sessions
const getLatestMarioKart8Session = async () => {
  try {
    const latestMK8Session: EnrichedSession | null =
      await prisma.session.findFirst({
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

    if (latestMK8Session != null) {
      return latestMK8Session;
    }
  } catch (error) {
    console.error("Error Fetching Latest Mario Kart Session");
  }
};

// Get detailed information about set by ID
const getMarioKart8SetById = async (setId: number) => {
  try {
    const mk8Set = await prisma.gameSet.findUnique({
      where: { setId },
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
    });
    console.log("Mario Kart 8 Set: ", mk8Set);
  } catch (error) {
    console.error("Error Fetching Mario Kart 8 Set");
  }
};

// Find Winner of Set(s)
// By ID
async function findWinnerOfSet(setId: number) {
  try {
    const mk8Set = await prisma.gameSet.findUnique({
      where: {
        setId: setId,
      },
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
    });

    // Copilot suggested this - logic doesnt seem sound

    if (mk8Set) {
      let winner = mk8Set.playerSessions[0];
      for (const playerSession of mk8Set.playerSessions) {
        if (playerSession.playerStats[0].value > winner.playerStats[0].value) {
          winner = playerSession;
        }
      }

      console.log(`Winner of Set ${setId}: ${winner.player.playerName}`);
    }
  } catch (error) {
    console.error("Error Fetching Winner of Set");
  }
}

// Also should do just given a Set object

// --- Helper Functions ---

// Print out stats for each player in each set grouped
function printPlayerStatsFromSet(
  latestMK8Session: EnrichedSession | undefined,
) {
  if (latestMK8Session) {
    for (const set of latestMK8Session.sets) {
      console.log(`--- Set ${set.setId} ---`);
      for (const playerSession of set.playerSessions) {
        console.log(`Player: ${playerSession.player.playerName}`);

        for (const playerStat of playerSession.playerStats) {
          console.log(`Stat ID: ${playerStat.statId} ${playerStat.value}`);
        }
      }
    }
  }
}

// Return a list of player stats per race in a set
async function getPlayerRankingsByRace(race: PlayerSession[]) {}

// Get player averages and rank (sorriest racer stat)

// --- Player Specific ---

// Get number of (nth) places

// --- TODO Laters ---

// Get All MK8 sessions (paginated)

// --- Main Function Since Vercel won't let me merge ---

// Testing Purposes Main Function (Comment out when not in use)
async function main() {
  const latestMK8Session = await getLatestMarioKart8Session();

  findWinnerOfSet(1);
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

// Chart Functions will make generic for all games afterwards

export const getAveragePlacing = async () => {
  console.log("AVERAGE PLACING RAN");
  // Fetch from game where game.gameName is mario kart or gameId is 1
  // and where gameStats.statName === MK8_POS or use statId (more efficient?)
  // Then loop through and compute average for each player

  // All player stats for the position stat (includes multiple sessions per user)
  const totalPlayerStats = await prisma.playerStat.findMany({
    where: { gameId: 1, AND: { statId: 1 } },
    select: {
      game: { select: { gameName: true } },
      gameStat: { select: { statName: true } },
      value: true,
      player: { select: { playerId: true, playerName: true } },
    },
  });

  const avgPlacingPerPlayer = new Map<string, { avg: number; count: number }>();
  // Compute total per player
  for (const playerStat of totalPlayerStats) {
    const avg = Number(playerStat.value);
    if (!avg) {
      // TODO Log to Posthog/Sentry
      console.log("Not a number");
      continue;
    }

    let player = avgPlacingPerPlayer.get(playerStat.player.playerName);
    if (!player)
      avgPlacingPerPlayer.set(playerStat.player.playerName, {
        avg,
        count: 1,
      });
    else {
      player.count += 1;
      player.avg += avg;
    }
  }
  // Compute average
  for (const [key, val] of avgPlacingPerPlayer) {
    val.avg = Math.round(val.avg / val.count);
  }

  return { avgPlacingPerPlayer, game: totalPlayerStats.at(0)?.game.gameName };
};
