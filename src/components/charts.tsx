"use client";

import { Pie, CartesianGrid, XAxis, Bar, BarChart, PieChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

export const PieChartRDC = ({
  config,
  data,
}: {
  config: ChartConfig;
  data: any[];
}) => {
  // TODO This Chart will rank the average of placements in each category.
  // TODO Reponsive not working. May need to mess with config or use grid resizing via css.
  return (
    <Card className="-ml-16 h-fit w-screen min-w-fit max-w-3xl transition-colors duration-500 hover:border-white md:m-auto md:w-72 lg:ml-0 lg:w-max">
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

const Chart = ({ config, data }: { config: ChartConfig; data: any[] }) => {
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
