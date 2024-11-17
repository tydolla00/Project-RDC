import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomChart } from "./_components/charts";
import { getAllGames } from "../../../../../../prisma/lib/games";
import { ChartConfig } from "@/components/ui/chart";
import {
  calculateMost1st,
  calculateMostSecondAndLast,
  calculateWinsPerPlayer,
  getAllStats,
  getAverage,
} from "./_functions/stats";

// ? Force non specified routes to return 404
export const dynamicParams = false; // true | false,

// TODO May need to revalidathPath/Tag after updating data.

export async function generateStaticParams() {
  const games = await getAllGames();
  return games.map((game) => ({
    slug: game.gameName.replace(/\s/g, "").toLowerCase(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const games = await getAllGames();
  const game = games.find(
    (game) =>
      game.gameName.replace(/\s/g, "").toLowerCase() === slug.toLowerCase(),
  )!;
  const { placings, wins } = await getAllStats(game);
  const winsPerPlayer = calculateWinsPerPlayer(wins!);

  const firstDesc = calculateMost1st(placings);
  console.log(wins, winsPerPlayer, firstDesc);

  return (
    <>
      <H1>{game.gameName}</H1>
      <Average placings={placings} />
      <LastPlace gameId={game.gameId} />
      <Card className="h-64 flex-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}

const Average = ({
  placings,
}: {
  placings: Awaited<ReturnType<typeof getAllStats>>["placings"];
}) => {
  const allAvgPlacing = getAverage(placings);
  const config = {
    player: { label: "Player" },
    placing: { label: "Avg Placing" },
    played: { label: "# of Races" },
  } satisfies ChartConfig;

  return (
    <div className="m-16">
      <CustomChart
        title="Average Placing"
        description="July - Now"
        data={allAvgPlacing}
        nameKey={"player"}
        config={config}
        dataKey={"placing"}
      />
    </div>
  );
};

const LastPlace = async ({ gameId }: { gameId: number }) => {
  const data = await calculateMostSecondAndLast(gameId);

  if (!data) return null;

  const config = {
    player: { label: "Player" },
    last: { label: "# of Last Places" },
  } satisfies ChartConfig;

  return (
    <div className="m-16">
      <CustomChart
        title="Most Last Places"
        description="Keeps track of who placed last the most."
        data={data}
        nameKey={"player"}
        config={config}
        dataKey={"last"}
      />
      <Card className="h-64 flex-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
