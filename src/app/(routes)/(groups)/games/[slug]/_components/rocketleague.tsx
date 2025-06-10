import { ChartConfig } from "@/components/ui/chart";
import { getWinsPerPlayer } from "../../../../../../../prisma/lib/games";
import { getAllMembers } from "../../../../../../../prisma/lib/members";
import { calcWinsPerPlayer, getRLStats } from "../_functions/stats";
import { CustomChart } from "./charts";
import { TabbedChart } from "../../../_components/tabbed-chart";
import { NoMembers } from "../../../members/_components/members";

const RocketLeague = async ({
  game,
}: {
  game: { gameId: number; gameName: string };
}) => {
  const members = await getAllMembers();

  if (!members.success || !members.data) {
    return <NoMembers />;
  }

  let membersMap = await Promise.all(
    members.data.map(async (member) => {
      try {
        const [goals, assists, saves, score, days] = await getRLStats(
          member.playerId,
        );
        return {
          ...member,
          goals: {
            sum: Number(goals?.sum),
            avg: Math.round(Number(goals?.avg)),
          },
          assists: {
            sum: Number(assists?.sum),
            avg: Math.round(Number(assists?.avg)),
          },
          saves: {
            sum: Number(saves?.sum),
            avg: Math.round(Number(saves?.avg)),
          },
          score: {
            sum: Number(score?.sum),
            avg: Math.round(Number(score?.avg)),
          },
          days: { sum: Number(days?.sum), avg: Math.round(Number(days?.avg)) },
        };
      } catch (error) {
        // TODO Do something if one of the requests fail.
        console.error(error);
        return {
          ...member,
          goals: { sum: -1, avg: -1 },
          assists: { sum: -1, avg: -1 },
          saves: { sum: -1, avg: -1 },
          score: { sum: -1, avg: -1 },
          days: { sum: -1, avg: -1 },
        };
      }
    }),
  );
  membersMap = membersMap.filter((d) => d?.score.sum !== 0);
  const wins = await getWinsPerPlayer(game.gameId);
  const wins2 = await getWinsPerPlayer(1); // For testing purposes, remove later
  if (!wins.success || !wins.data) wins.data = { sessions: [] };

  const winsPerPlayer = calcWinsPerPlayer(wins.data); // Sets / Wins
  // console.log(winsPerPlayer);
  // console.dir({ wins }, { depth: null });
  // console.log("Last session", wins.data.sessions.at(-1));
  // console.dir({ wins2 }, { depth: null });
  // console.log("Last session", wins2.data?.sessions.at(-1));
  console.log(JSON.stringify(wins.data.sessions, null, 2));
  console.log(JSON.stringify(wins2.data?.sessions, null, 2));

  const config = {
    player: { label: "Player" },
    matchWins: { label: "Matches won" },
    setWins: { label: "Sets won" },
    days: { label: "Days won" },
  } satisfies ChartConfig;

  const sumConfig = {
    playerName: { label: "Player" },
    ["goals.sum"]: { label: "Total Goals" },
    ["score.avg"]: { label: "Avg Score" },
    ["assists.sum"]: { label: "Total Assists" },
    ["days.sum"]: { label: "Total Days" },
    ["saves.sum"]: { label: "Total Saves" },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-wrap justify-center gap-10">
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="goals.sum"
        title="Goals Per Player"
        description="Goals scored all time"
        config={sumConfig}
        ignoreWarnings
      />
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="saves.sum"
        title="Saves Per Player"
        description="Shots saved all time"
        config={sumConfig}
        ignoreWarnings
      />
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="assists.sum"
        title="Assists All Time"
        description="All time Assists"
        config={sumConfig}
        ignoreWarnings
      />
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="score.avg"
        title="Average Score"
        description="Average Score"
        config={sumConfig}
        ignoreWarnings
      />
      {/* <CustomChart
        // @ts-ignore
        data={membersMap}
        nameKey="playerName"
        dataKey="days.sum"
        title="Days Won"
        description="The amount of days each member has won."
        config={sumConfig}
        ignoreWarnings // No days in db currently
      /> */}
      <TabbedChart chartConfig={config} chartData={winsPerPlayer} />
    </div>
  );
};
export default RocketLeague;
