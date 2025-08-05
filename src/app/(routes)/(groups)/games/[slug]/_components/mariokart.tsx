import { ChartConfig } from "@/components/ui/chart";
import { getWinsPerPlayer } from "../../../../../../../prisma/lib/games";
import { getAllMembers } from "../../../../../../../prisma/lib/members";
import { CustomChart } from "./charts";
import { TabbedChart } from "../../../_components/tabbed-chart";
import { NoMembers } from "../../../members/_components/members";
import { calcWinsPerPlayer, getAvgAndSum } from "../_functions/stats";

const MarioKart = async ({
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
        const { pos, day } = await getAvgAndSum(member.playerId, [
          "MK8_POS",
          "MK8_DAY",
        ]);
        return {
          ...member,
          pos: { sum: Number(pos?.sum), avg: Number(pos?.avg) },
          day: { sum: Number(day?.sum), avg: Number(day?.avg) },
        };
      } catch (error) {
        console.error(error);
        return {
          ...member,
          pos: { sum: -1, avg: -1 },
          day: { sum: -1, avg: -1 },
        };
      }
    }),
  );
  membersMap = membersMap.filter((d) => d?.pos.sum > 0);
  const wins = await getWinsPerPlayer(game.gameId);
  if (!wins.success || !wins.data) wins.data = { sessions: [] };

  const winsPerPlayer = calcWinsPerPlayer(wins.data);

  const config = {
    player: { label: "Player" },
    matchWins: { label: "Races won" },
    setWins: { label: "Sets won" },
    days: { label: "Days won" },
  } satisfies ChartConfig;

  const avgConfig = {
    playerName: { label: "Player" },
    ["pos.avg"]: { label: "Avg Position" },
    ["day.sum"]: { label: "Total Days Won" },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-wrap justify-center gap-10">
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="pos.avg"
        title="Average Position"
        description="Average race position all time"
        config={avgConfig}
        ignoreWarnings
      />
      <TabbedChart chartConfig={config} chartData={winsPerPlayer} />
    </div>
  );
};
export default MarioKart;