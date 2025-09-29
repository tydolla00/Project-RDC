import { statNames } from "@/lib/stat-names";
import * as fs from "fs";
import prisma from "./db";
import { capitalizeFirst } from "@/lib/utils";
import { MembersEnum } from "@/lib/constants";
import { EnrichedSession } from "./types/session";

const [
  MK8_POS,
  MK8_DAY,
  RL_SCORE,
  RL_GOALS,
  RL_ASSISTS,
  RL_SAVES,
  RL_SHOTS,
  RL_DAY,
  COD_KILLS,
  COD_DEATHS,
  COD_SCORE,
  COD_POS,
  COD_MELEES,
  LC_DEATHS,
  SR_WINS,
  SR_SETS,
  SR_POS,
  MR_KILLS,
  MR_DEATHS,
  MR_ASSISTS,
  MR_TRIPLE_KILL,
  MR_QUADRA_KILL,
  MR_PENTA_KILL,
  MR_HEXA_KILL,
  MR_MEDALS,
  MR_HIGHEST_DMG,
  MR_HIGHEST_DMG_BLOCKED,
  MR_MOST_HEALING,
  MR_MOST_ASSISTS_FIST,
  MR_FINAL_HITS,
  MR_DMG,
  MR_DMG_BLOCKED,
  MR_HEALING,
  MR_ACCURACY,
] = statNames;

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
        create: [{ statName: MK8_POS }, { statName: MK8_DAY }],
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
          { statName: RL_SCORE },
          { statName: RL_GOALS },
          { statName: RL_ASSISTS },
          { statName: RL_SAVES },
          { statName: RL_SHOTS },
          { statName: RL_DAY },
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
          { statName: COD_SCORE },
          { statName: COD_KILLS },
          { statName: COD_DEATHS },
          { statName: COD_POS },
          { statName: COD_MELEES },
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
        create: [{ statName: LC_DEATHS }],
      },
    },
  });

  await prisma.game.upsert({
    where: { gameName: "SpeedRunners" },
    update: {},
    create: {
      gameName: "SpeedRunners",
      gameStats: {
        create: [
          { statName: SR_WINS },
          { statName: SR_SETS },
          { statName: SR_POS },
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
          { statName: MR_KILLS },
          { statName: MR_DEATHS },
          { statName: MR_ASSISTS },
          { statName: MR_TRIPLE_KILL },
          { statName: MR_QUADRA_KILL },
          { statName: MR_PENTA_KILL },
          { statName: MR_HEXA_KILL },
          { statName: MR_MEDALS },
          { statName: MR_HIGHEST_DMG },
          { statName: MR_HIGHEST_DMG_BLOCKED },
          { statName: MR_MOST_HEALING },
          { statName: MR_MOST_ASSISTS_FIST },
          { statName: MR_FINAL_HITS },
          { statName: MR_DMG },
          { statName: MR_DMG_BLOCKED },
          { statName: MR_HEALING },
          { statName: MR_ACCURACY },
        ],
      },
    },
  });
  console.log("Games Seeded Successfully.\n");
}

// Import and Process Sessions
async function importSessions() {
  /**
   * Imports sessions from a JSON file and populates the database.
   *
   * Reads sessions.json, processes each session, and logs progress/errors.
   */

  // Read the sessions.json file
  // ! Add File Path Here
  const sessionsPath = "D:/repos/Project-RDC/sessions_backup.json";
  let sessionsData: EnrichedSession[];
  console.log(`Importing sessions from ${sessionsPath}...`);

  try {
    sessionsData = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
  } catch (error) {
    console.error(
      `Failed to read sessions.json: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }

  // Process sessions in parallel with configurable concurrency
  const concurrency = Number(process.env.SEED_CONCURRENCY) || 4;
  console.log(
    `Importing ${sessionsData.length} sessions with concurrency=${concurrency}`,
  );

  const processSession = async (sessionData: EnrichedSession) => {
    try {
      const game = await prisma.game.findFirst({
        where: { gameName: sessionData.Game.gameName },
      });
      if (!game) {
        console.log(
          `Skipping session ${sessionData.sessionId} (${sessionData.sessionName}) - game ${sessionData.Game.gameName} not found`,
        );
        return;
      }

      console.log(
        `Processing session ${sessionData.sessionId}: ${sessionData.sessionName}`,
      );

      const session = await prisma.session.create({
        data: {
          sessionName: sessionData.sessionName,
          sessionUrl: sessionData.sessionUrl,
          thumbnail: sessionData.thumbnail,
          videoId: sessionData.videoId,
          gameId: game.gameId,
          date: new Date(sessionData.date),
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

      // TODO Need to handle dynamic stats and players

      for (const setData of sessionData.sets) {
        await prisma.$transaction(
          async (tx) => {
            const set = await tx.gameSet.create({
              data: { sessionId: session.sessionId },
            });

            for (const matchData of setData.matches) {
              const match = await tx.match.create({
                data: { setId: set.setId, date: new Date(matchData.date) },
              });

              for (const playerSessionData of matchData.playerSessions) {
                const playerSession = await tx.playerSession.create({
                  data: {
                    playerId: playerSessionData.player.playerId,
                    matchId: match.matchId,
                    setId: set.setId,
                    sessionId: session.sessionId,
                  },
                });

                if (playerSessionData.playerStats?.length) {
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
              }

              if (matchData.matchWinners?.length) {
                await tx.match.update({
                  where: { matchId: match.matchId },
                  data: {
                    matchWinners: {
                      connect: matchData.matchWinners.map((w) => ({
                        playerId: w.playerId,
                      })),
                    },
                  },
                });
              }
            }

            if (setData.setWinners?.length) {
              await tx.gameSet.update({
                where: { setId: set.setId },
                data: {
                  setWinners: {
                    connect: setData.setWinners.map((w) => ({
                      playerId: w.playerId,
                    })),
                  },
                },
              });
            }
          },
          { timeout: 20000, maxWait: 25000 },
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
    }
  };

  // Simple worker pool
  let nextIndex = 0;
  const workers: Promise<void>[] = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(
      (async () => {
        while (true) {
          const idx = nextIndex++;
          if (idx >= sessionsData.length) return;
          await processSession(sessionsData[idx]);
        }
      })(),
    );
  }

  await Promise.all(workers);

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
