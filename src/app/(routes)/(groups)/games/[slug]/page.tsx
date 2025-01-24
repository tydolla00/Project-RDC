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
import Image from "next/image";
import { gameImages } from "@/lib/constants";

// ? Force non specified routes to return 404
export const dynamicParams = false; // true | false,

// TODO May need to revalidatePath/Tag after updating data.

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
      <div className="flex gap-5">
        <Image
          className="object-cover"
          height={200}
          width={200}
          alt=""
          src={`/images/${gameImages[gameName as keyof typeof gameImages]}`}
        />
        <H1 className="my-0">{game.gameName}</H1>
      </div>
      {component}
      {/* <Average placings={placings} />
      <LastPlace gameId={game.gameId} /> */}
    </div>
  );
}

const Sessions = () => {
  // TODO This will be a table with all of the currently submitted sessions for a game. Show the name. url, and thumbnail.
};

// const Average = ({
// }: {
// }) => {
//   const config = {
//     player: { label: "Player" },
//     placing: { label: "Avg Placing" },
//     played: { label: "# of Races" },
//   } satisfies ChartConfig;

//   return (
//     <CustomChart
//       title="Average Placing"
//       description="July - Now"
//       data={allAvgPlacing}
//       nameKey={"player"}
//       config={config}
//       dataKey={"placing"}
//     />
//   );
// };

// const LastPlace = async ({ gameId }: { gameId: number }) => {

//   const config = {
//     player: { label: "Player" },
//     last: { label: "# of Last Places" },
//   } satisfies ChartConfig;

//   return (
//     <>
//       <CustomChart
//         title="Most Last Places"
//         description="Keeps track of who placed last the most."
//         data={data}
//         nameKey={"player"}
//         config={config}
//         dataKey={"last"}
//       />
//     </>
//   );
// };
