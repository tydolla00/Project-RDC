import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAveragePlacing } from "../../../../../../prisma/lib/marioKart";
import { Chart } from "./_components/charts";

const getGame = (slug: string) => {
  const game = { name: slug };
  console.log("In game");
  return getAveragePlacing();
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGame(slug);
  console.log(game);

  return (
    <div className="m-16">
      <H1>{game.game}</H1>
      <Chart avgPlacing={game.avgPlacingPerPlayer} />
      <Card className="h-64 flex-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
