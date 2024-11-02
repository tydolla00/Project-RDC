/*
  Warnings:

  - You are about to drop the column `stat_value` on the `game_stats` table. All the data in the column will be lost.
  - The primary key for the `player_sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `game_session_player_id` on the `player_sessions` table. All the data in the column will be lost.
  - The primary key for the `player_stats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_played` on the `player_stats` table. All the data in the column will be lost.
  - You are about to drop the column `player_game_stat_id` on the `player_stats` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `player_stats` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `player_session_id` to the `player_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `set_id` to the `player_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_session_id` to the `player_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_stat_id` to the `player_stats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "GameSet" (
    "set_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" INTEGER NOT NULL,
    CONSTRAINT "GameSet_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_game_stats" (
    "stat_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "game_id" INTEGER NOT NULL,
    "stat_name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "game_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_game_stats" ("date", "game_id", "stat_id", "stat_name") SELECT "date", "game_id", "stat_id", "stat_name" FROM "game_stats";
DROP TABLE "game_stats";
ALTER TABLE "new_game_stats" RENAME TO "game_stats";
CREATE TABLE "new_player_sessions" (
    "player_session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "set_id" INTEGER NOT NULL,
    CONSTRAINT "player_sessions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_sessions_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "GameSet" ("set_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_player_sessions" ("player_id", "session_id") SELECT "player_id", "session_id" FROM "player_sessions";
DROP TABLE "player_sessions";
ALTER TABLE "new_player_sessions" RENAME TO "player_sessions";
CREATE TABLE "new_player_stats" (
    "player_stat_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "stat_id" INTEGER NOT NULL,
    "player_session_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_stats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "game_stats" ("stat_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_stats_player_session_id_fkey" FOREIGN KEY ("player_session_id") REFERENCES "player_sessions" ("player_session_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_player_stats" ("game_id", "player_id", "stat_id", "value") SELECT "game_id", "player_id", "stat_id", "value" FROM "player_stats";
DROP TABLE "player_stats";
ALTER TABLE "new_player_stats" RENAME TO "player_stats";
CREATE TABLE "new_sessions" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_name" TEXT NOT NULL,
    "session_url" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_sessions" ("session_id", "session_name", "session_url") SELECT "session_id", "session_name", "session_url" FROM "sessions";
DROP TABLE "sessions";
ALTER TABLE "new_sessions" RENAME TO "sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
