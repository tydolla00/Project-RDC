import { getWinsPerPlayer } from "../../../../../../../prisma/lib/games";
import { getAllMembers } from "../../../../../../../prisma/lib/members";
import { calcWinsPerPlayer, getAvgAndSum } from "../_functions/stats";

const RocketLeague = async ({
  game,
}: {
  game: { gameId: number; gameName: string };
}) => {
  const members = await getAllMembers();
  let membersMap = await Promise.all(
    members.map(async (member) => {
      try {
        const { goals, assists, saves, score, day } = await getAvgAndSum(
          member.playerId,
          ["RL_GOALS", "RL_ASSISTS", "RL_SAVES", "RL_SCORE", "RL_DAY"],
        );
        return {
          ...member,
          goals: { sum: Number(goals?.sum), avg: Number(goals?.avg) },
          assists: { sum: Number(assists?.sum), avg: Number(assists?.avg) },
          saves: { sum: Number(saves?.sum), avg: Number(saves?.avg) },
          score: { sum: Number(score?.sum), avg: Number(score?.avg) },
          day: { sum: Number(day?.sum), avg: Number(day?.avg) },
        };
      } catch (error) {
        // TODO Do something if one of the requests fail.
      }
    }),
  );
  console.log({ membersMap });
  const wins = await getWinsPerPlayer(game.gameId);
  const winsPerPlayer = calcWinsPerPlayer(wins!); // Sets / Wins
  console.log(winsPerPlayer);

  return <div>rocketleague</div>;
};
export default RocketLeague;
