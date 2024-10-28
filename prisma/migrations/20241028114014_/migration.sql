/*
  Warnings:

  - You are about to drop the `game_sessions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `session_id` to the `player_stats` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "game_sessions";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_name" TEXT NOT NULL,
    "session_url" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_game_session_players" (
    "game_session_player_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    CONSTRAINT "game_session_players_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "game_session_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_game_session_players" ("game_session_player_id", "player_id", "session_id") SELECT "game_session_player_id", "player_id", "session_id" FROM "game_session_players";
DROP TABLE "game_session_players";
ALTER TABLE "new_game_session_players" RENAME TO "game_session_players";
CREATE TABLE "new_player_stats" (
    "player_game_stat_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "stat_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "date_played" DATETIME NOT NULL,
    CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_stats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "game_stats" ("stat_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_player_stats" ("date_played", "game_id", "player_game_stat_id", "player_id", "stat_id", "value") SELECT "date_played", "game_id", "player_game_stat_id", "player_id", "stat_id", "value" FROM "player_stats";
DROP TABLE "player_stats";
ALTER TABLE "new_player_stats" RENAME TO "player_stats";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
