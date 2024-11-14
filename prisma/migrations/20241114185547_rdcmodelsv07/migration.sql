/*
  Warnings:

  - Added the required column `thumbnail` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sessions" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "session_name" TEXT NOT NULL,
    "session_url" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sessions" ("date", "game_id", "session_id", "session_name", "session_url") SELECT "date", "game_id", "session_id", "session_name", "session_url" FROM "sessions";
DROP TABLE "sessions";
ALTER TABLE "new_sessions" RENAME TO "sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
