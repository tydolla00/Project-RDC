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
import { BarChart, YAxis, CartesianGrid, XAxis, Bar } from "recharts";

export function CustomChart<T extends unknown[]>({
  data,
  nameKey,
  config,
  dataKey,
  title,
  description,
  // ignoreWarnings = false,
}: {
  data: T;
  nameKey: string;
  config: ChartConfig;
  dataKey: string;
  title: string;
  description: string;
  ignoreWarnings?: boolean;
}): React.ReactElement {
  // if (!ignoreWarnings && data.some((d) => typeof d=== "object" && d !== null && d[nameKey] === undefined))
  //   console.error("NameKey not present in data passed to chart.");
  // if (!ignoreWarnings && data.some((d) => typeof d=== "object" && d !== null && d[dataKey] === undefined))
  //   console.error("DataKey not present in data passed to chart");

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-60 w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={nameKey}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend
              content={<ChartLegendContent nameKey={nameKey.toString()} />}
            />
            <Bar dataKey={dataKey} fill="var(--chart-1)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
