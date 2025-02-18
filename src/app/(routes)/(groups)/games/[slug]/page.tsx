import { H1 } from "@/components/headings";
import { CustomChart } from "./_components/charts";
import { getAllGames } from "../../../../../../prisma/lib/games";
import { ChartConfig } from "@/components/ui/chart";
import Mariokart from "./_components/mariokart";
import CallOfDuty from "./_components/callofduty";
import RocketLeague from "./_components/rocketleague";
import Speedrunners from "./_components/speedrunners";
import LethalCompany from "./_components/lethalcompany";
import GolfWithFriends from "./_components/golfwithfriends";
import { GamesEnum } from "@/lib/constants";

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
  )!;

  const gameName = slug.toLowerCase() as GamesEnum;
  let component: React.ReactNode;
  switch (gameName) {
    case GamesEnum.MarioKart8:
      component = <Mariokart game={game} />;
      break;
    case GamesEnum.CallOfDuty:
      component = <CallOfDuty game={game} />;
      break;
    case GamesEnum.RocketLeague:
      component = <RocketLeague game={game} />;
      break;
    case GamesEnum.SpeedRunners:
      component = <Speedrunners game={game} />;
      break;
    case GamesEnum.LethalCompany:
      component = <LethalCompany game={game} />;
      break;
    // case "golfwithfriends":
    //   component = <GolfWithFriends game={game} />;
    //   break;
  }

  return (
    <div className="m-16">
      <H1>{game.gameName}</H1>
      {component}
    </div>
  );
}
