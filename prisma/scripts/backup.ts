import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { EnrichedSession } from "../types/session";

const prisma = new PrismaClient();

async function backupSessions() {
  try {
    const sessions: EnrichedSession[] = await prisma.session.findMany({
      include: {
        Game: true,
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

    fs.writeFileSync("sessions_backup.json", JSON.stringify(sessions, null, 2));
    console.log("Successfully backed up sessions to sessions_backup.json");
  } catch (error) {
    console.error("Error backing up sessions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backupSessions();
