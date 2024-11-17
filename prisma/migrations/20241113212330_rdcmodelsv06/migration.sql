/*
  Warnings:

  - You are about to drop the `GameSet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `match_id` to the `player_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GameSet";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "sets" (
    "set_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_id" INTEGER NOT NULL,
    CONSTRAINT "sets_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("session_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "matches" (
    "match_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "set_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "matches_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets" ("set_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GameSetToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GameSetToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "sets" ("set_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameSetToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "players" ("player_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MatchToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MatchToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "matches" ("match_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MatchToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "players" ("player_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_player_sessions" (
    "player_session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,
    "set_id" INTEGER NOT NULL,
    CONSTRAINT "player_sessions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_sessions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches" ("match_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "player_sessions_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets" ("set_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_player_sessions" ("player_id", "player_session_id", "session_id", "set_id") SELECT "player_id", "player_session_id", "session_id", "set_id" FROM "player_sessions";
DROP TABLE "player_sessions";
ALTER TABLE "new_player_sessions" RENAME TO "player_sessions";
CREATE TABLE "new_sessions" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_name" TEXT NOT NULL,
    "session_url" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sessions" ("date", "game_id", "session_id", "session_name", "session_url") SELECT "date", "game_id", "session_id", "session_name", "session_url" FROM "sessions";
DROP TABLE "sessions";
ALTER TABLE "new_sessions" RENAME TO "sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_GameSetToPlayer_AB_unique" ON "_GameSetToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_GameSetToPlayer_B_index" ON "_GameSetToPlayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MatchToPlayer_AB_unique" ON "_MatchToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_MatchToPlayer_B_index" ON "_MatchToPlayer"("B");
