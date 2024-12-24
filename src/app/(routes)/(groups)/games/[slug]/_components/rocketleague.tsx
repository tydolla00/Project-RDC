import {
  getDaysPerPlayer,
  getScoreStatsPerPlayer,
  getWinsPerPlayer,
} from "../../../../../../../prisma/lib/games";
import {
  calcAvgPerPlayer,
  calcMostPerStat,
  calculateStatPerPlayer,
  calculateWinsPerPlayer,
} from "../_functions/stats";

const RocketLeague = async ({
  game,
}: {
  game: { gameId: number; gameName: string };
}) => {
  const wins = await getWinsPerPlayer(game.gameId);
  const winsPerPlayer = calculateWinsPerPlayer(wins!); // Sets / Wins

  const days = await getDaysPerPlayer(game.gameId, "RL_DAY");
  const daysPerPlayer = calcMostPerStat(days?.playerStats!);

  const score = await getScoreStatsPerPlayer(game.gameId, "RL_SCORE");
  console.log(score.length);
  const avgScorePerPlayer = calcAvgPerPlayer(score);

  const goals = await calculateStatPerPlayer(game.gameId, "RL_GOALS");

  const assists = await calculateStatPerPlayer(game.gameId, "RL_ASSISTS");
  const saves = await calculateStatPerPlayer(game.gameId, "RL_SAVES");

  console.log({
    winsPerPlayer,
    daysPerPlayer,
    avgScorePerPlayer,
    goals,
    assists,
    saves,
  });
  return <div>rocketleague</div>;
};
export default RocketLeague;
