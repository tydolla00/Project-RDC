"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import { BarChart, YAxis } from "recharts";
import { CartesianGrid, XAxis, Bar } from "recharts";
import { getPlacings } from "../../../../../../../prisma/lib/marioKart";

export const Chart = ({
  avgPlacing,
}: {
  avgPlacing: Awaited<ReturnType<typeof getPlacings>>["placingPerPlayer"];
}) => {
  const data = Array.from(avgPlacing, ([key, val]) => ({
    player: key,
    placing: val.avg,
    played: val.count,
  }));
  const config = {
    player: { label: "Player" },
    placing: { label: "Avg Placing" },
    played: { label: "# of Races" },
  } satisfies ChartConfig;
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Average Placing</CardTitle>
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
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent nameKey="player" />} />
            <Bar dataKey="placing" fill="hsl(var(--chart-1))" radius={4} />
            {/* <Bar dataKey="played" fill="hsl(var(--chart-2))" radius={4} /> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
