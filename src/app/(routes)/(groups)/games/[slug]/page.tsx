import { H1 } from "@/components/headings";
import { getAllGames } from "../../../../../../prisma/lib/games";
import { getAllSessionsByGame } from "../../../../../../prisma/lib/admin"; // Import getAllSessions
import Mariokart from "./_components/mariokart";
import CallOfDuty from "./_components/callofduty";
import RocketLeague from "./_components/rocketleague";
import Speedrunners from "./_components/speedrunners";
import LethalCompany from "./_components/lethalcompany";
import GolfWithFriends from "./_components/golfwithfriends";
import { gameImages, GamesEnum } from "@/lib/constants";
import { TimelineChart } from "../../_components/timeline-chart";
import { Separator } from "@/components/ui/separator";

// ? Force non specified routes to return 404
export const dynamicParams = false; // true | false,

export async function generateStaticParams() {
  const games = await getAllGames();

  if (!games.success || !games.data) games.data = [];
  return games.data.map((game) => ({
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

  if (!games.success || !games.data) return <NoGames />;

  const game = games.data.find(
    (game) => game.gameName.replace(/\s/g, "").toLowerCase() === slug,
  )!;

  const sessions = await getAllSessionsByGame(game.gameId); // Fetch sessions
  if (!sessions.success || !sessions.data) sessions.data = [];

  const gameName = slug as GamesEnum;
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

  const normalGameName = game.gameName
    .replace(/\s/g, "")
    .toLowerCase() as keyof typeof gameImages;

  return (
    <div className="m-16">
      <H1 className="my-0">{game.gameName}</H1>
      <TimelineChart
        gameName={normalGameName}
        sessions={sessions.data.slice(1)}
        title={`${game.gameName} Videos`}
        desc="Use the keyboard to view specific data for a video"
      />
      <Separator className="my-4" />
      {component}
    </div>
  );
}

const NoGames = () => (
  <div className="m-16">
    <H1 className="my-0">No games found</H1>
    <p className="text-muted-foreground">
      No games found. Please check back later.
    </p>
  </div>
);
