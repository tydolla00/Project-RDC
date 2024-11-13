import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAveragePlacing } from "../../../../../../prisma/lib/marioKart";
import { Chart } from "./_components/charts";
import {
  getAllGames,
  getWinsPerPlayer,
} from "../../../../../../prisma/lib/games";

// ? Force non specified routes to return 404
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
  );
  const uncalculatedWins = await getWinsPerPlayer(game!.gameId);
  const winsPerPlayer = calculateWinsPerPlayer(uncalculatedWins!);
  console.log(uncalculatedWins, winsPerPlayer);

  const allAvgPlacing = await getAveragePlacing();

  return (
    <div className="m-16">
      <H1>{game!.gameName}</H1>
      <Chart avgPlacing={allAvgPlacing.avgPlacingPerPlayer} />
      <Card className="h-64 flex-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

const calculateWinsPerPlayer = (
  game: NonNullable<Awaited<ReturnType<typeof getWinsPerPlayer>>>,
) => {
  const members = new Map<string, { matchWins: number; setWins: number }>();

  for (const session of game.sessions) {
    for (const set of session.sets) {
      // Calculate Match Wins
      for (const match of set.matches) {
        for (const winner of match.matchWinner) {
          let member = members.get(winner.playerName);
          if (!member)
            members.set(winner.playerName, { matchWins: 1, setWins: 0 });
          else member.matchWins += 1;
        }
      }
      // Calculate Set Wins
      for (const winner of set.setWinner) {
        let member = members.get(winner.playerName);
        if (!member)
          members.set(winner.playerName, { matchWins: 0, setWins: 1 });
        else member.setWins += 1;
      }
    }
  }
  return members;
};
