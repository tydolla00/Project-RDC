/*
  Warnings:

  - Changed the type of `stat_name` on the `game_stats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatName" AS ENUM ('MK8_POS', 'RL_SCORE', 'RL_GOALS', 'RL_ASSISTS', 'RL_SAVES', 'COD_KILLS', 'COD_DEATHS', 'COD_SCORE', 'LC_DEATHS', 'SR_WINS', 'SR_SETS');

-- AlterTable
ALTER TABLE "game_stats" DROP COLUMN "stat_name",
ADD COLUMN     "stat_name" "StatName" NOT NULL;
