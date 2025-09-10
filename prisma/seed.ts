import { StatName } from "@prisma/client";
import * as fs from "fs";
import prisma from "./db";
import { capitalizeFirst } from "@/lib/utils";
import { MembersEnum } from "@/lib/constants";
import { EnrichedSession } from "./types/session";

/**
 * Seeds the database with RDC members, games, and sessions.
 *
 * Runs all seeding steps and logs progress and errors.
 */
async function main() {
  console.group("Begin seeding database");
  console.time("Seeding Time");
  try {
    await seedRDCMembers();
    await seedGames();
    await importSessions();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    console.timeEnd("Seeding Time");
    console.groupEnd();
  }
}

// Seed RDC Members
async function seedRDCMembers() {
  /**
   * Seeds RDC members into the database.
   */
  console.log("--- Seeding RDC Members ---");

  await prisma.player.upsert({
    where: { playerId: 1 },
    update: {},
    create: {
      playerId: 1,
      playerName: capitalizeFirst(MembersEnum.Mark),
    },
  });

  await prisma.player.upsert({
    where: { playerId: 2 },
    update: {},
    create: {
      playerId: 2,
      playerName: capitalizeFirst(MembersEnum.Dylan),
    },
  });

  await prisma.player.upsert({
    where: { playerId: 3 },
    update: {},
    create: {
      playerId: 3,
      playerName: capitalizeFirst(MembersEnum.Ben),
    },
  });

  await prisma.player.upsert({
    where: { playerId: 4 },
    update: {},
    create: {
      playerId: 4,
      playerName: capitalizeFirst(MembersEnum.Lee),
    },
  });

  await prisma.player.upsert({
    where: { playerId: 5 },
    update: {},
    create: {
      playerId: 5,
      playerName: capitalizeFirst(MembersEnum.Des),
    },
  });

  await prisma.player.upsert({
    where: { playerId: 6 },
    update: {},
    create: {
      playerId: 6,
      playerName: capitalizeFirst(MembersEnum.John),
    },
  });

  await prisma.player.upsert({
    where: { playerId: 7 },
    update: {},
    create: {
      playerId: 7,
      playerName: capitalizeFirst(MembersEnum.Aff),
    },
  });

  await prisma.player.upsert({
    where: { playerId: 8 },
    update: {},
    create: {
      playerId: 8,
      playerName: capitalizeFirst(MembersEnum.Ipi),
    },
  });

  console.log("RDC Members Seeded Successfully.\n");
}

// Seed Games
async function seedGames() {
  /**
   * Seeds games and their stats into the database.
   */
  console.log("--- Seeding Games ---");

  await prisma.game.upsert({
    where: { gameName: "Mario Kart 8" },
    update: {},
    create: {
      gameName: "Mario Kart 8",
      gameStats: {
        create: [
          { statName: StatName.MK8_POS },
          { statName: StatName.MK8_DAY },
        ],
      },
    },
  });

  await prisma.game.upsert({
    where: { gameName: "Rocket League" },
    update: {},
    create: {
      gameName: "Rocket League",
      gameStats: {
        create: [
          { statName: StatName.RL_SCORE },
          { statName: StatName.RL_GOALS },
          { statName: StatName.RL_ASSISTS },
          { statName: StatName.RL_SAVES },
          { statName: StatName.RL_SHOTS },
          { statName: StatName.RL_DAY },
        ],
      },
    },
  });

  await prisma.game.upsert({
    where: { gameName: "Call of Duty" },
    update: {},
    create: {
      gameName: "Call of Duty",
      gameStats: {
        create: [
          { statName: StatName.COD_SCORE },
          { statName: StatName.COD_KILLS },
          { statName: StatName.COD_DEATHS },
          { statName: StatName.COD_MELEES },
          { statName: StatName.COD_POS },
        ],
      },
    },
  });

  await prisma.game.upsert({
    where: { gameName: "Lethal Company" },
    update: {},
    create: {
      gameName: "Lethal Company",
      gameStats: {
        create: [{ statName: StatName.LC_DEATHS }],
      },
    },
  });

  await prisma.game.upsert({
    where: { gameName: "Speedrunners" },
    update: {},
    create: {
      gameName: "Speedrunners",
      gameStats: {
        create: [
          { statName: StatName.SR_SETS },
          { statName: StatName.SR_WINS },
          { statName: StatName.SR_POS },
        ],
      },
    },
  });

  await prisma.game.upsert({
    where: { gameName: "Marvel Rivals" },
    update: {},
    create: {
      gameName: "Marvel Rivals",
      gameStats: {
        create: [
          { statName: StatName.MR_KILLS },
          { statName: StatName.MR_DEATHS },
          { statName: StatName.MR_ASSISTS },
          { statName: StatName.MR_TRIPLE_KILL },
          { statName: StatName.MR_QUADRA_KILL },
          { statName: StatName.MR_PENTA_KILL },
          { statName: StatName.MR_HEXA_KILL },
          { statName: StatName.MR_MEDALS },
          { statName: StatName.MR_HIGHEST_DMG },
          { statName: StatName.MR_HIGHEST_DMG_BLOCKED },
          { statName: StatName.MR_MOST_HEALING },
          { statName: StatName.MR_MOST_ASSISTS_FIST },
          { statName: StatName.MR_FINAL_HITS },
          { statName: StatName.MR_DMG },
          { statName: StatName.MR_DMG_BLOCKED },
          { statName: StatName.MR_HEALING },
          { statName: StatName.MR_ACCURACY },
        ],
      },
    },
  });

  console.log("Games seeded successfully\n");
}

async function importSessions() {
  /**
   * Imports sessions from a JSON file and populates the database.
   *
   * Reads sessions.json, processes each session, and logs progress/errors.
   */
  console.log("Importing sessions from sessions.json...");

  // Read the sessions.json file
  // ! Add File Path Here
  const sessionsPath = "/Users/silver/repos/Project-RDC/sessions_backup.json";
  let sessionsData: EnrichedSession[];

  try {
    sessionsData = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
  } catch (error) {
    console.error(
      `Failed to read sessions.json: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }

  // Process each session
  for (const sessionData of sessionsData) {
    try {
      // First find the game outside of transaction
      const game = await prisma.game.findFirst({
        where: { gameName: sessionData.Game.gameName },
      });

      if (!game) {
        console.log(
          `Skipping session ${sessionData.sessionId} (${sessionData.sessionName}) - game ${sessionData.Game.gameName} not found`,
        );
        continue;
      }

      console.log(
        `Processing session ${sessionData.sessionId}: ${sessionData.sessionName}`,
      );

      // Create session
      const session = await prisma.session.create({
        data: {
          sessionName: sessionData.sessionName,
          sessionUrl: sessionData.sessionUrl,
          thumbnail: sessionData.thumbnail,
          videoId: sessionData.videoId,
          gameId: game.gameId,
          date: sessionData.date || new Date(),
          dayWinners: {
            connect: sessionData.dayWinners.map((sd) => ({
              playerId: sd.playerId,
            })),
          },
          mvpId: sessionData.mvpId,
          mvpDescription: sessionData.mvpDescription,
          mvpStats: sessionData.mvpStats ?? undefined,
        },
      });

      // Process each set in its own transaction
      for (const setData of sessionData.sets) {
        await prisma.$transaction(
          async (tx) => {
            const set = await tx.gameSet.create({
              data: {
                sessionId: session.sessionId,
              },
            });

            // Process matches
            for (const matchData of setData.matches) {
              const match = await tx.match.create({
                data: {
                  setId: set.setId,
                  date: new Date(matchData.date),
                },
              });

              // Process player sessions and stats
              for (const playerSessionData of matchData.playerSessions) {
                const playerSession = await tx.playerSession.create({
                  data: {
                    playerId: playerSessionData.player.playerId,
                    matchId: match.matchId,
                    setId: set.setId,
                    sessionId: session.sessionId,
                  },
                });

                // Create player stats in batch using createMany
                await tx.playerStat.createMany({
                  data: playerSessionData.playerStats.map((statData) => ({
                    value: statData.value,
                    date: new Date(statData.date),
                    playerId: playerSessionData.player.playerId,
                    gameId: game.gameId,
                    playerSessionId: playerSession.playerSessionId,
                    statId: statData.gameStat.statId,
                  })),
                });
              }

              // Set match winners
              if (matchData.matchWinners?.length) {
                await tx.match.update({
                  where: { matchId: match.matchId },
                  data: {
                    matchWinners: {
                      connect: matchData.matchWinners.map((winner) => ({
                        playerId: winner.playerId,
                      })),
                    },
                  },
                });
              }
            }

            // Set set winners if they exist
            if (setData.setWinners?.length) {
              await tx.gameSet.update({
                where: { setId: set.setId },
                data: {
                  setWinners: {
                    connect: setData.setWinners.map((winner) => ({
                      playerId: winner.playerId,
                    })),
                  },
                },
              });
            }
          },
          {
            timeout: 20000, // 20 second timeout for each set transaction
            maxWait: 25000, // Maximum time to wait for transaction
          },
        );
      }

      console.log(
        `Successfully imported session ${sessionData.sessionId}: ${sessionData.sessionName}`,
      );
    } catch (error) {
      console.error(
        `Failed to import session ${sessionData.sessionId} (${sessionData.sessionName}):`,
        error instanceof Error ? error.message : "Unknown error",
      );
      // Continue with next session instead of throwing
      continue;
    }
  }

  console.log("All sessions imported successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
