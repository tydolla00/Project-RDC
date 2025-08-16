import { NoMembers } from "@/app/(routes)/(groups)/members/_components/members";
import { ChartConfig } from "@/components/ui/chart";
import { getWinsPerPlayer } from "../../../../../../../../prisma/lib/games";
import { getAllMembers } from "../../../../../../../../prisma/lib/members";
import { getAvgAndSum, calcWinsPerPlayer } from "../../_helpers/stats";
import { CustomChart } from "../charts";
import { TabbedChart } from "../tabbed-chart";

const CallOfDuty = async ({
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
        const { kills, deaths, score, pos, melees } = await getAvgAndSum(
          member.playerId,
          ["COD_KILLS", "COD_DEATHS", "COD_SCORE", "COD_POS", "COD_MELEES"],
        );
        return {
          ...member,
          kills: { sum: Number(kills?.sum), avg: Number(kills?.avg) },
          deaths: { sum: Number(deaths?.sum), avg: Number(deaths?.avg) },
          score: { sum: Number(score?.sum), avg: Number(score?.avg) },
          pos: { sum: Number(pos?.sum), avg: Number(pos?.avg) },
          melees: { sum: Number(melees?.sum), avg: Number(melees?.avg) },
        };
      } catch (error) {
        console.error(error);
        return {
          ...member,
          kills: { sum: -1, avg: -1 },
          deaths: { sum: -1, avg: -1 },
          score: { sum: -1, avg: -1 },
          pos: { sum: -1, avg: -1 },
          melees: { sum: -1, avg: -1 },
        };
      }
    }),
  );
  membersMap = membersMap.filter((d) => d?.score.sum > 0);
  const wins = await getWinsPerPlayer(game.gameId);
  if (!wins.success || !wins.data) wins.data = { sessions: [] };

  const winsPerPlayer = calcWinsPerPlayer(wins.data);

  const config = {
    player: { label: "Player" },
    matchWins: { label: "Matches won" },
    setWins: { label: "Sets won" },
    days: { label: "Days won" },
  } satisfies ChartConfig;

  const sumConfig = {
    playerName: { label: "Player" },
    ["kills.sum"]: { label: "Total Kills" },
    ["deaths.sum"]: { label: "Total Deaths" },
    ["score.avg"]: { label: "Avg Score" },
    ["pos.avg"]: { label: "Avg Position" },
    ["melees.sum"]: { label: "Total Melees" },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-wrap justify-center gap-10">
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="kills.sum"
        title="Kills Per Player"
        description="Kills all time"
        config={sumConfig}
        ignoreWarnings
      />
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="deaths.sum"
        title="Deaths Per Player"
        description="Deaths all time"
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
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="pos.avg"
        title="Average Position"
        description="Average Position"
        config={sumConfig}
        ignoreWarnings
      />
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="melees.sum"
        title="Melees Per Player"
        description="Melees all time"
        config={sumConfig}
        ignoreWarnings
      />
      <TabbedChart chartConfig={config} chartData={winsPerPlayer} />
    </div>
  );
};
export default CallOfDuty;
