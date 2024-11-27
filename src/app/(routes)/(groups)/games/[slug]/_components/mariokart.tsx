import { getDaysPerPlayer } from "../../../../../../../prisma/lib/games";
import {
  getAllStats,
  calculateWinsPerPlayer,
  calcMostPerPlacing,
  calcMostPerStat,
  calcAvgPerPlayer,
} from "../_functions/stats";

const Mariokart = async ({
  game,
}: {
  game: { gameId: number; gameName: string };
}) => {
  const { placings, wins } = await getAllStats(game);
  const winsPer = calculateWinsPerPlayer(wins!); // Most Wins/Sets
  const days = await getDaysPerPlayer(game.gameId, "MK8_DAY");
  const daysPer = calcMostPerStat(days?.playerStats || []); // Most Days. Fix nullish type.
  const placingPer = await calcMostPerPlacing(game.gameId); // Most 1st, 2nd, 3rd, last, ....
  const avgPlacingPer = calcAvgPerPlayer(placings); // Average Placing
  console.log({ winsPer }, { daysPer }, { placingPer }, { avgPlacingPer });
  // TODO I'm thinking we only show the top player of each category and then if they want they click a more detailed view to show everything for pos stats.
  return <div>mariokart</div>;
};
export default Mariokart;
