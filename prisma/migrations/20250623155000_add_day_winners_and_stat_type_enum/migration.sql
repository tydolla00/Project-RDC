/*
  Warnings:

  - The `type` column on the `game_stats` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatType" AS ENUM ('INT', 'STRING');

-- AlterTable
ALTER TABLE "game_stats" DROP COLUMN "type",
ADD COLUMN     "type" "StatType" NOT NULL DEFAULT 'INT';

-- CreateTable
CREATE TABLE "_PlayerToSession" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlayerToSession_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlayerToSession_B_index" ON "_PlayerToSession"("B");

-- AddForeignKey
ALTER TABLE "_PlayerToSession" ADD CONSTRAINT "_PlayerToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerToSession" ADD CONSTRAINT "_PlayerToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
