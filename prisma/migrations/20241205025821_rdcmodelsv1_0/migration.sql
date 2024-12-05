-- CreateTable
CREATE TABLE "players" (
    "player_id" SERIAL NOT NULL,
    "player_name" TEXT NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "games" (
    "game_id" SERIAL NOT NULL,
    "game_name" TEXT NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "game_stats" (
    "stat_id" SERIAL NOT NULL,
    "stat_name" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,
    "type" TEXT,

    CONSTRAINT "game_stats_pkey" PRIMARY KEY ("stat_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" SERIAL NOT NULL,
    "session_name" TEXT NOT NULL,
    "session_url" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "sets" (
    "set_id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("set_id")
);

-- CreateTable
CREATE TABLE "matches" (
    "match_id" SERIAL NOT NULL,
    "set_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "player_sessions" (
    "player_session_id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,
    "set_id" INTEGER NOT NULL,

    CONSTRAINT "player_sessions_pkey" PRIMARY KEY ("player_session_id")
);

-- CreateTable
CREATE TABLE "player_stats" (
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
CREATE TABLE "_GameSetToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MatchToPlayer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GameSetToPlayer_AB_unique" ON "_GameSetToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_GameSetToPlayer_B_index" ON "_GameSetToPlayer"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MatchToPlayer_AB_unique" ON "_MatchToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_MatchToPlayer_B_index" ON "_MatchToPlayer"("B");

-- AddForeignKey
ALTER TABLE "game_stats" ADD CONSTRAINT "game_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sets" ADD CONSTRAINT "sets_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("set_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("set_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_session_id_fkey" FOREIGN KEY ("player_session_id") REFERENCES "player_sessions"("player_session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "game_stats"("stat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSetToPlayer" ADD CONSTRAINT "_GameSetToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "sets"("set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSetToPlayer" ADD CONSTRAINT "_GameSetToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchToPlayer" ADD CONSTRAINT "_MatchToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "matches"("match_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchToPlayer" ADD CONSTRAINT "_MatchToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;