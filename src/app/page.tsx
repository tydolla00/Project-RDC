"use client";

import { H1, H2 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="m-16">
        <div
          style={{ transitionDuration: "2000ms" }}
          className="grid grid-cols-2"
        >
          <div>
            <H1>RDC Stat Tracker</H1>
            <p className="w-3/4 leading-7 text-muted-foreground">
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
          <PieChartRDC />
          {/* <Chart /> */}
        </div>
        <H2 className="mx-auto my-10 w-fit text-chart-4">Games</H2>
        <div className="flex gap-10">
          {[0, 0, 0, 0, 0, 0, 0, 0].map((c, i) => (
            <Card key={i} className="h-64 w-64">
              <CardHeader>
                <CardTitle>Test</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <H2 className="mx-auto my-10 w-fit text-chart-4">Want to Help</H2>
        <Card className="mx-auto h-64 w-1/2">
          <CardHeader>
            <CardContent>
              <p>
                We could use some help keeping up scores. We have a place where
                you can submit scores and we&apos;ll review them and compare
                with other scores. In order to submit scores you must be signed
                in.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/submission")}
              >
                Submit new entry
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
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

const PieChartRDC = () => {
  // TODO This Chart will rank the average of placements in each category.
  // TODO Reponsive not working. May need to mess with config or use grid resizing via css.
  return (
    <Card className="h-fit min-w-fit max-w-3xl">
      <CardHeader>
        <CardTitle>Sorry scale</CardTitle>
        <CardDescription>
          This chart represents the average ranking of each member across all
          games. AKA who is the sorriest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="min-h-32" config={config}>
          <PieChart>
            <Pie data={data} dataKey="sorryScale" nameKey="player" />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const Chart = () => {
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>3v3 Rocket League</CardTitle>
        <CardDescription>July - Now</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-60 w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="player"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent nameKey="player" />} />
            <Bar dataKey="sorryCounter" fill="hsl(var(--chart-1))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p>Trending up by 5%</p>
      </CardFooter>
    </Card>
  );
};
