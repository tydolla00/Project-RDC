import { calculateStatPerPlayer } from "../_functions/stats";

const RocketLeague = async ({
  game,
}: {
  game: { gameId: number; gameName: string };
}) => {
  const goals = await calculateStatPerPlayer(game.gameId, "RL_GOALS");
  console.log("Most goals", goals);
  return <div>rocketleague</div>;
};
export default RocketLeague;
