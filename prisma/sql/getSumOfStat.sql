-- @param {Int} $1:playerId
-- @param {String} $2:statName
SELECT SUM(CAST(value AS INTEGER)), AVG(CAST(value AS INTEGER))
FROM player_stats 
INNER JOIN game_stats ON player_stats.stat_id = game_stats.stat_id 
WHERE player_id = $1 AND stat_name::text = $2;