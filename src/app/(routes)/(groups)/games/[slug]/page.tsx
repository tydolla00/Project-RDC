import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAveragePlacing } from "../../../../../../prisma/lib/marioKart";
import { Chart } from "./_components/charts";
import { getAllGames } from "../../../../../../prisma/lib/games";

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
  const gameName = games.find(
    (game) =>
      game.gameName.replace(/\s/g, "").toLowerCase() === slug.toLowerCase(),
  )?.gameName;

  const allAvgPlacing = await getAveragePlacing();

  return (
    <div className="m-16">
      <H1>{gameName}</H1>
      <Chart avgPlacing={allAvgPlacing.avgPlacingPerPlayer} />
      <Card className="h-64 flex-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
