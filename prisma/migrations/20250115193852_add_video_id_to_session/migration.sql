/*
  Warnings:

  - Added the required column `videoId` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "videoId" TEXT NOT NULL;
