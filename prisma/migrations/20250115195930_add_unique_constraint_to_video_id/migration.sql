/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_videoId_key" ON "sessions"("videoId");
