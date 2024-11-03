/*
  Warnings:

  - You are about to drop the column `release_date` on the `Game` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "game_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "game_name" TEXT NOT NULL
);
INSERT INTO "new_Game" ("game_id", "game_name") SELECT "game_id", "game_name" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
