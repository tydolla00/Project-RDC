"use cache";
import { H1 } from "@/components/headings";
import { getAllGames, getWinsPerPlayer } from "prisma/lib/games";
import { getAllSessionsByGame } from "prisma/lib/admin"; // Import getAllSessions
import Mariokart from "./_components/games/mariokart";
import CallOfDuty from "./_components/games/callofduty";
import RocketLeague from "./_components/games/rocketleague";
import Speedrunners from "./_components/games/speedrunners";
import LethalCompany from "./_components/games/lethalcompany";
// import GolfWithFriends from "./_components/golfwithfriends";
import { gameImages, GamesEnum } from "@/lib/constants";
import { TimelineChart } from "./_components/timeline/timeline-chart";
import { Separator } from "@/components/ui/separator";
import { getAllMembers } from "prisma/lib/members";
import { NoMembers } from "../../members/_components/members";
import { calcWinsPerPlayer } from "./_helpers/stats";

export type Members = NonNullable<
  Awaited<ReturnType<typeof getAllMembers>>["data"]
>;

export async function generateStaticParams() {
  const games = await getAllGames();

  if (!games.success || !games.data || games.data.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  const params = games.data.map((game) => ({
    slug: game.gameName.replace(/\s/g, "").toLowerCase(),
  }));
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const games = await getAllGames();

  if (!games.success || !games.data || slug === "__placeholder__")
    return <NoGames />;

  const game = games.data.find(
    (game) => game.gameName.replace(/\s/g, "").toLowerCase() === slug,
  )!;

  const sessions = await getAllSessionsByGame(game.gameId); // Fetch sessions
  if (!sessions.success || !sessions.data) sessions.data = [];

  const gameName = slug as GamesEnum;
  let component: React.ReactNode;

  const members = await getAllMembers();
  const wins = await getWinsPerPlayer(game.gameId);
  if (!wins.success || !wins.data) wins.data = { sessions: [] };
  const winsPerPlayer = calcWinsPerPlayer(wins.data);

  if (!members.success || !members.data) {
    return <NoMembers />;
  }

  switch (gameName) {
    case GamesEnum.MarioKart8:
      component = (
        <Mariokart
          game={game}
          members={members.data}
          winsPerPlayer={winsPerPlayer}
        />
      );
      break;
    case GamesEnum.CallOfDuty:
      component = (
        <CallOfDuty
          game={game}
          members={members.data}
          winsPerPlayer={winsPerPlayer}
        />
      );
      break;
    case GamesEnum.RocketLeague:
      component = (
        <RocketLeague
          game={game}
          members={members.data}
          winsPerPlayer={winsPerPlayer}
        />
      );
      break;
    case GamesEnum.SpeedRunners:
      component = (
        <Speedrunners
          game={game}
          members={members.data}
          winsPerPlayer={winsPerPlayer}
        />
      );
      break;
    case GamesEnum.LethalCompany:
      component = (
        <LethalCompany
          game={game}
          members={members.data}
          winsPerPlayer={winsPerPlayer}
        />
      );
      break;
    // case "golfwithfriends":
    //   component = <GolfWithFriends game={game} />;
    //   break;
  }

  return (
    <div className="m-16">
      <H1 className="my-0">{game.gameName}</H1>
      <TimelineChart
        gameName={
          game.gameName
            .replace(/\s/g, "")
            .toLowerCase() as keyof typeof gameImages
        }
        sessions={sessions.data}
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
