import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { EnrichedSession } from "../types/session";

const prisma = new PrismaClient();

async function backupSessions() {
  try {
    const sessions: EnrichedSession[] = await prisma.session.findMany({
      include: {
        Game: {
          include: {
            gameStats: true,
          },
        },
        dayWinners: true,
        mvp: true,
        sets: {
          include: {
            setWinners: true,
            matches: {
              include: {
                matchWinners: true,
                playerSessions: {
                  include: {
                    player: true,
                    playerStats: {
                      include: {
                        gameStat: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const outPath = path.resolve(process.cwd(), "sessions_backup.json");
    fs.writeFileSync(outPath, JSON.stringify(sessions, null, 2));
    console.log(`Successfully backed up sessions to ${outPath}`);
  } catch (error) {
    console.error("Error backing up sessions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backupSessions();
