/*
  Warnings:

  - You are about to drop the `game_session_players` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "game_session_players";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "player_sessions" (
    "game_session_player_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    CONSTRAINT "player_sessions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_sessions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
