import { PieChartRDC } from "@/components/charts";
import { H1, H2 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import Link from "next/link";
import { getAllGames } from "../../prisma/lib/games";
import { FeatureFlag } from "@/lib/featureflag";

export default async function Home() {
  const games = await getAllGames();

  return (
    <>
      <div className="m-16">
        <div
          style={{ transitionDuration: "2000ms" }}
          className="grid grid-cols-2"
        >
          <div className="col-span-2 md:col-span-1">
            <H1>RDC Stat Tracker</H1>
            <p className="leading-7 text-muted-foreground md:w-3/4">
              This site is dedicated to tracking and celebrating the gaming
              stats and achievements of RDC (Real Dreams Change the World). As a
              fan of their incredible teamwork and drive, I created this space
              to follow their journey, showcase their wins, and dive into the
              numbers behind the action. From game highlights to individual
              performances, explore the latest stats and stay connected with
              everything RDC. Join me in cheering them on as they continue to
              change the game and inspire fans like us!
            </p>
            <Button asChild>
              <Link className="my-5" href="/games">
                Browse Games
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link className="my-5 ml-5" href="/members">
                Members
              </Link>
            </Button>
          </div>
          <PieChartRDC config={config} data={data} />
        </div>
        <H2 className="mx-auto mb-6 mt-40 w-fit text-chart-4 md:my-10">
          Games
        </H2>
        <div className="flex flex-wrap justify-center gap-10">
          {games.map((game) => (
            <Card key={game.gameId} className="h-64 w-64">
              <CardHeader>
                <CardTitle>{game.gameName}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <FeatureFlag
          devOnly
          flagName="SUBMISSION_FORM"
          user={{}}
          shouldRedirect={false}
        >
          <H2 className="mx-auto my-10 w-fit text-chart-4">Want to Help</H2>
          <Card className="mx-auto w-1/2">
            <CardHeader>
              <p>
                We could use some help keeping up scores. We have a place where
                you can submit scores and we&apos;ll review them and compare
                with other scores. In order to submit scores you must be signed
                in.
              </p>
            </CardHeader>
            <CardFooter>
              <Button asChild className="mt-4">
                <Link href="/submissions">Submit new entry</Link>
              </Button>
            </CardFooter>
          </Card>
        </FeatureFlag>
      </div>
    </>
  );
}

const data = [
  {
    player: "mark",
    sorryCounter: 100,
    sorryScale: 0.15,
    fill: "hsl(var(--chart-1))",
  },
  {
    player: "leland",
    sorryCounter: 50,
    sorryScale: 0.15,
    fill: "hsl(var(--chart-2))",
  },
  {
    player: "ben",
    sorryCounter: 50,
    sorryScale: 0.3,
    fill: "hsl(var(--chart-3))",
  },
  {
    player: "john",
    sorryCounter: 20,
    sorryScale: 0.05,
    fill: "hsl(var(--chart-4))",
  },
  {
    player: "aff",
    sorryCounter: 10,
    sorryScale: 0.3,
    fill: "hsl(var(--chart-5))",
  },
  {
    player: "dylan",
    sorryCounter: 30,
    sorryScale: 0.05,
    fill: "green",
  },
];

const config = {
  player: { label: "Player" },
  mark: { label: "Mark", color: "hsl(var(--chart-1))" },
  ben: { label: "Ben", color: "hsl(var(--chart-2))" },
  leland: { label: "Leland", color: "hsl(var(--chart-3))" },
  john: { label: "John", color: "hsl(var(--chart-4))" },
  aff: { label: "Aff", color: "hsl(var(--chart-5))" },
  dylan: { label: "Dylan", color: "green" },
} satisfies ChartConfig;
