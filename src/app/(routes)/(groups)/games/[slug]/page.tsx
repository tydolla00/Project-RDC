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

  const gameName = slug.toLowerCase();
  let component: React.ReactNode;
  switch (gameName) {
    case "mariokart":
      component = <Mariokart game={game} />;
      break;
    case "callofduty":
      component = <CallOfDuty game={game} />;
      break;
    case "rocketleague":
      component = <RocketLeague game={game} />;
      break;
    case "speedrunners":
      component = <Speedrunners game={game} />;
      break;
    case "lethalcompany":
      component = <LethalCompany game={game} />;
      break;
    case "golfwithfriends":
      component = <GolfWithFriends game={game} />;
      break;
  }

  return (
    <div className="m-16">
      <H1>{game.gameName}</H1>
      {component}
      {/* <Average placings={placings} />
      <LastPlace gameId={game.gameId} /> */}
    </div>
  );
}

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
