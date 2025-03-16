import { PieChartRDC } from "@/components/charts";
import { H1, H2 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import Link from "next/link";
import { getGamesNav } from "@/lib/constants";
import { FeatureFlag } from "@/lib/featureflag";
import { auth } from "@/auth";
import Image from "next/image";

export default async function Home() {
  const games = await getGamesNav();
  const session = await auth();
  return (
    <>
      <div className="m-16">
        <div
          style={{ transitionDuration: "2000ms" }}
          className="grid grid-cols-2"
        >
          <div className="col-span-2 md:col-span-1">
            <H1>RDC Stat Tracker</H1>
            <p className="text-muted-foreground leading-7 md:w-3/4">
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
        <H2 className="text-chart-4 mx-auto mt-40 mb-6 w-fit md:my-10">
          Games
        </H2>
        <div className="flex flex-wrap justify-center gap-10">
          {games.map((game) => (
            <div key={game.url}>
              {game.src && (
                <Card className="group relative aspect-square h-52 w-full min-w-24 overflow-hidden transition-transform duration-700 sm:w-52">
                  <Link href={game.url}>
                    {/* TODO Fix warning in browser related to sizing of the image. */}
                    <Image
                      className="absolute h-full w-full object-cover transition-transform duration-500 group-hover:scale-125"
                      fill
                      sizes="(max-width: 639px) 100vw, 100vw"
                      alt=""
                      src={game.src || ""}
                    />
                    <CardHeader className="relative h-1/4 bg-black/50">
                      <CardTitle className="absolute font-extrabold text-white opacity-100">
                        {game.name}
                      </CardTitle>
                    </CardHeader>
                  </Link>
                </Card>
              )}
            </div>
          ))}
        </div>
        <FeatureFlag
          devOnly
          flagName="SUBMISSION_FORM"
          user={session}
          shouldRedirect={false}
        >
          <H2 className="text-chart-4 mx-auto my-10 w-fit">Want to Help</H2>
          <Card className="mx-auto md:w-1/2">
            <CardHeader>
              <p>
                We could use some help keeping up scores. We have a place where
                you can submit scores and we&apos;ll review them and compare
                with other scores. In order to submit scores you must be signed
                in.
              </p>
            </CardHeader>
            <CardFooter>
              <Button
                asChild
                className="mt-4 w-full sm:mx-auto sm:block sm:w-fit"
              >
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
    fill: "blue",
  },
  {
    player: "leland",
    sorryCounter: 50,
    sorryScale: 0.15,
    fill: "purple",
  },
  {
    player: "ben",
    sorryCounter: 50,
    sorryScale: 0.3,
    fill: "green",
  },
  {
    player: "john",
    sorryCounter: 20,
    sorryScale: 0.05,
    fill: "skyblue",
  },
  {
    player: "aff",
    sorryCounter: 10,
    sorryScale: 0.3,
    fill: "orange",
  },
  {
    player: "dylan",
    sorryCounter: 30,
    sorryScale: 0.05,
    fill: "red",
  },
];

const config = {
  player: { label: "Player" },
  mark: { label: "Mark", color: "blue" },
  ben: { label: "Ben", color: "yellow" },
  leland: { label: "Leland", color: "red" },
  john: { label: "John", color: "purple" },
  aff: { label: "Aff", color: "orange" },
  dylan: { label: "Dylan", color: "blue" },
} satisfies ChartConfig;
