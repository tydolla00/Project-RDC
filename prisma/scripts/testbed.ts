import prisma from "../db";
import { EnrichedSession } from "../types/session";
import { EnrichedGameSet } from "../types/gameSet";

async function main() {
  console.log(await getAllTimeMKRankings());
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
            matches: {
              include: {
                playerSessions: {
                  include: {
                    playerStats: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (latestMKPlayerSessions != null) {
      console.log("Latest Mario Kart Session: ", [latestMKPlayerSessions]);
      console.log("Set 1: ", showSetResults(latestMKPlayerSessions.sets[0]));
    }
  } catch (error) {
    console.error("Error Fetching Latest Mario Kart Session");
  }
}

// /**
//  * Takes a mario kart set and prints out the stats for each player.
//  * Format:
//  * Player: playerName
//  * Rankings: []number
//  * @param mkSession
//  */
async function showSetResults(mkSet: EnrichedGameSet) {
  for (const match of mkSet.matches) {
    console.log("Looking at match: ", match);
    for (const playerSession of match.playerSessions) {
      console.log(
        `Looking at PlayerSession: , ${playerSession} for ${playerSession.player}`,
      );
      console.log(
        `Player Stats: ${playerSession.playerStats.map((stat) => stat.value).join(", ")}`,
      );
    }
  }
}

async function getAllTimeMKRankings() {
  const playerStats = await prisma.playerStat.findMany({
    where: {
      gameId: 1,
      statId: 1,
    },
    include: {
      player: true,
      game: true,
      gameStat: true,
      playerSession: true,
    },
  });

  console.log("Player Stats", playerStats);
}

// async function showSetStatsByPlayerByRace(mkSession: EnrichedSession[]) {
//   // Group Stats For A Set By Player
//   for (const session of mkSession) {
//     for (const set of session.sets) {
//       console.log(`--- Set ${set.setId} ---`);
//       const playerStatsMap: { [playerName: string]: string[] } = {};

//       for (const playerSession of set.playerSessions) {
//         const playerName = playerSession.player.playerName;
//         if (!playerStatsMap[playerName]) {
//           playerStatsMap[playerName] = [];
//         }
//         for (const playerStat of playerSession.playerStats) {
//           playerStatsMap[playerName].push(playerStat.value);
//         }
//       }

//       for (const playerName in playerStatsMap) {
//         console.log(`\nPlayer: ${playerName}`);
//         console.log(`Placements: ${playerStatsMap[playerName].join(", ")}`);
//       }
//       console.log(getMK8RankingsFromSet(set));
//     }
//   }
// }

/**
/* Given a MK8 Set, return the rankings for each player and the number of points they received
 * @param set 
 * @returns 
 */
// async function getMK8RankingsFromSet(set: EnrichedGameSet) {
//   const pointsMap = [6, 4, 3, 2, 1];
//   const playerPoints: { [playerName: string]: number } = {
//     Mark: 0,
//     Dylan: 0,
//     Ben: 0,
//     Lee: 0,
//     Des: 0,
//   };

//   // Leaving these comments logs in for debugging purposes TODO: Remove when done
//   for (const playerSession of set.playerSessions) {
//     // console.log(`Looking at PlayerSession ${playerSession.playerSessionId}`);

//     const playerName = playerSession.player.playerName;

//     for (const playerStat of playerSession.playerStats) {
//       // console.log(`\nLooking at statId${playerStat.statId}`);

//       const placement = parseInt(playerStat.value);
//       // console.log(
//       //   `${playerName} placed ${placement} and received ${pointsMap[placement - 1]} points`,
//       // );
//       if (placement >= 1 && placement <= 5) {
//         const pointsWon = pointsMap[placement - 1];
//         // console.log(`Points Won: ${pointsWon}`);
//         playerPoints[playerName] += pointsWon;
//         // console.log("Player Points: ", playerPoints);
//       }
//     }
// //   }

//   const rankings = Object.entries(playerPoints)
//     .sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
//     .map(([playerName, points], index) => ({
//       rank: index + 1,
//       playerName,
//       points,
//     }));

//   return rankings;
// }

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
