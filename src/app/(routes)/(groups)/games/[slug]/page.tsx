import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlacings } from "../../../../../../prisma/lib/marioKart";
import { Chart } from "./_components/charts";
import { getAllGames } from "../../../../../../prisma/lib/games";
import { getSetsPerPlayer } from "../../../../../../prisma/lib/utils";

export const dynamicParams = false; // true | false,

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

  const { placingPerPlayer } = await getPlacings();
  const allSetsPerPlayer = await getSetsPerPlayer(game.gameId);

  return (
    <div className="m-16">
      <H1>{game.gameName}</H1>
      <Chart avgPlacing={placingPerPlayer} />
      <Card className="h-64 flex-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
