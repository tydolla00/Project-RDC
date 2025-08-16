import { NoMembers } from "@/app/(routes)/(groups)/members/_components/members";
import { ChartConfig } from "@/components/ui/chart";
import { getWinsPerPlayer } from "prisma/lib/games";
import { getAllMembers } from "prisma/lib/members";
import { getAvgAndSum, calcWinsPerPlayer } from "../../_helpers/stats";
import { CustomChart } from "../charts";
import { TabbedChart } from "../tabbed-chart";

const LethalCompany = async ({
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
        const { deaths } = await getAvgAndSum(member.playerId, ["LC_DEATHS"]);
        return {
          ...member,
          deaths: { sum: Number(deaths?.sum), avg: Number(deaths?.avg) },
        };
      } catch (error) {
        console.error(error);
        return {
          ...member,
          deaths: { sum: -1, avg: -1 },
        };
      }
    }),
  );
  membersMap = membersMap.filter((d) => d?.deaths.sum > 0);
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
    ["deaths.sum"]: { label: "Total Deaths" },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-wrap justify-center gap-10">
      <CustomChart
        data={membersMap}
        nameKey="playerName"
        dataKey="deaths.sum"
        title="Deaths Per Player"
        description="Deaths all time"
        config={sumConfig}
        ignoreWarnings
      />
      <TabbedChart chartConfig={config} chartData={winsPerPlayer} />
    </div>
  );
};
export default LethalCompany;
