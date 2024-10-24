/*
  Warnings:

  - You are about to drop the column `date_play` on the `player_stats` table. All the data in the column will be lost.
  - Added the required column `date_played` to the `player_stats` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "game_sessions" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "game_session_players" (
    "game_session_player_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    CONSTRAINT "game_session_players_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions" ("session_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "game_session_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_player_stats" (
    "player_game_stat_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "stat_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "date_played" DATETIME NOT NULL,
    CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_stats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "game_stats" ("stat_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_player_stats" ("game_id", "player_game_stat_id", "player_id", "stat_id", "value") SELECT "game_id", "player_game_stat_id", "player_id", "stat_id", "value" FROM "player_stats";
DROP TABLE "player_stats";
ALTER TABLE "new_player_stats" RENAME TO "player_stats";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
