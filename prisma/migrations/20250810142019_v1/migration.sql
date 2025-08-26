-- CreateEnum
CREATE TYPE "public"."StatName" AS ENUM ('MK8_POS', 'MK8_DAY', 'RL_SCORE', 'RL_GOALS', 'RL_ASSISTS', 'RL_SAVES', 'RL_SHOTS', 'RL_DAY', 'COD_KILLS', 'COD_DEATHS', 'COD_SCORE', 'COD_POS', 'COD_MELEES', 'LC_DEATHS', 'SR_WINS', 'SR_SETS', 'SR_POS');

-- CreateEnum
CREATE TYPE "public"."StatType" AS ENUM ('INT', 'STRING');

-- CreateTable
CREATE TABLE "public"."players" (
    "player_id" SERIAL NOT NULL,
    "player_name" TEXT NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "public"."games" (
    "game_id" SERIAL NOT NULL,
    "game_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "public"."game_stats" (
    "stat_id" SERIAL NOT NULL,
    "stat_name" "public"."StatName" NOT NULL,
    "game_id" INTEGER NOT NULL,
    "type" "public"."StatType" NOT NULL DEFAULT 'INT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "game_stats_pkey" PRIMARY KEY ("stat_id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "session_id" SERIAL NOT NULL,
    "session_name" TEXT NOT NULL,
    "session_url" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoId" TEXT NOT NULL,
    "mvpId" INTEGER,
    "mvpDescription" TEXT,
    "mvpStats" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT NOT NULL DEFAULT 'SYSTEM',

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "public"."sets" (
    "set_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("set_id")
);

-- CreateTable
CREATE TABLE "public"."matches" (
    "match_id" SERIAL NOT NULL,
    "set_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "public"."player_sessions" (
    "player_session_id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,
    "set_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_sessions_pkey" PRIMARY KEY ("player_session_id")
);

-- CreateTable
CREATE TABLE "public"."player_stats" (
    "player_stat_id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "player_session_id" INTEGER NOT NULL,
    "stat_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_stats_pkey" PRIMARY KEY ("player_stat_id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_DayWinners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DayWinners_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_GameSetToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameSetToPlayer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MatchToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MatchToPlayer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_game_name_key" ON "public"."games"("game_name");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_game_id_videoId_key" ON "public"."sessions"("game_id", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "_DayWinners_B_index" ON "public"."_DayWinners"("B");

-- CreateIndex
CREATE INDEX "_GameSetToPlayer_B_index" ON "public"."_GameSetToPlayer"("B");

-- CreateIndex
CREATE INDEX "_MatchToPlayer_B_index" ON "public"."_MatchToPlayer"("B");

-- AddForeignKey
ALTER TABLE "public"."game_stats" ADD CONSTRAINT "game_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_mvpId_fkey" FOREIGN KEY ("mvpId") REFERENCES "public"."players"("player_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sets" ADD CONSTRAINT "sets_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."matches" ADD CONSTRAINT "matches_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."player_sessions" ADD CONSTRAINT "player_sessions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."player_sessions" ADD CONSTRAINT "player_sessions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("match_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."player_sessions" ADD CONSTRAINT "player_sessions_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "public"."sets"("set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."player_stats" ADD CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."player_stats" ADD CONSTRAINT "player_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."player_stats" ADD CONSTRAINT "player_stats_player_session_id_fkey" FOREIGN KEY ("player_session_id") REFERENCES "public"."player_sessions"("player_session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."player_stats" ADD CONSTRAINT "player_stats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "public"."game_stats"("stat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DayWinners" ADD CONSTRAINT "_DayWinners_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DayWinners" ADD CONSTRAINT "_DayWinners_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameSetToPlayer" ADD CONSTRAINT "_GameSetToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."sets"("set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameSetToPlayer" ADD CONSTRAINT "_GameSetToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MatchToPlayer" ADD CONSTRAINT "_MatchToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."matches"("match_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MatchToPlayer" ADD CONSTRAINT "_MatchToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;
