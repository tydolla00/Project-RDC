-- DropForeignKey
ALTER TABLE "game_stats" DROP CONSTRAINT "game_stats_game_id_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_set_id_fkey";

-- DropForeignKey
ALTER TABLE "player_sessions" DROP CONSTRAINT "player_sessions_match_id_fkey";

-- DropForeignKey
ALTER TABLE "player_sessions" DROP CONSTRAINT "player_sessions_player_id_fkey";

-- DropForeignKey
ALTER TABLE "player_sessions" DROP CONSTRAINT "player_sessions_set_id_fkey";

-- DropForeignKey
ALTER TABLE "player_stats" DROP CONSTRAINT "player_stats_game_id_fkey";

-- DropForeignKey
ALTER TABLE "player_stats" DROP CONSTRAINT "player_stats_player_id_fkey";

-- DropForeignKey
ALTER TABLE "player_stats" DROP CONSTRAINT "player_stats_player_session_id_fkey";

-- DropForeignKey
ALTER TABLE "player_stats" DROP CONSTRAINT "player_stats_stat_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_game_id_fkey";

-- DropForeignKey
ALTER TABLE "sets" DROP CONSTRAINT "sets_session_id_fkey";

-- AddForeignKey
ALTER TABLE "game_stats" ADD CONSTRAINT "game_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sets" ADD CONSTRAINT "sets_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("match_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_sessions" ADD CONSTRAINT "player_sessions_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_session_id_fkey" FOREIGN KEY ("player_session_id") REFERENCES "player_sessions"("player_session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_stat_id_fkey" FOREIGN KEY ("stat_id") REFERENCES "game_stats"("stat_id") ON DELETE CASCADE ON UPDATE CASCADE;
