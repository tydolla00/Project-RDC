import { cacheLife } from "next/cache";
import { handlePrismaOperation } from "../db";

/**
 * Retrieves all video sessions from the database, including associated game names.
 *
 * Uses cache for 1 week (604800 seconds), tagged with "getAllSessions".
 *
 * @returns Promise resolving to an array of video sessions with game names.
 */
export const getAllSessions = async () => {
  "use cache";
  cacheLife("max");
  return await handlePrismaOperation((prisma) =>
    prisma.session.findMany({
      include: { Game: { select: { gameName: true } } },
    }),
  );
};

/**
 * Retrieves all sessions for a specific game.
 *
 * @param gameId - Game ID
 * @returns Promise resolving to an array of session objects, each including the game name.
 *
 * @remarks
 * Uses cache for 1 week (604800 seconds), tagged with "getAllSessions".
 *
 * @example
 * const sessions = await getAllSessionsByGame(1);
 * console.log(sessions);
 */
export const getAllSessionsByGame = async (gameId: number) => {
  "use cache";
  cacheLife("max");
  return await handlePrismaOperation((prisma) =>
    prisma.session.findMany({
      where: { gameId },
      select: {
        date: true,
        sessionId: true,
        sessionName: true,
        sessionUrl: true,
        thumbnail: true,
        dayWinners: true,
        mvp: true,
        mvpDescription: true,
        mvpStats: true,
        Game: { select: { gameName: true } },
        sets: {
          select: {
            setWinners: true,
            matches: {
              select: {
                matchWinners: true,
                playerSessions: {
                  select: {
                    playerStats: {
                      select: {
                        value: true,
                        player: true,
                        gameStat: {
                          select: {
                            statName: true,
                            statId: true,
                            type: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { date: "asc" },
    }),
  );
};
