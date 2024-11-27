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

export const CustomChart = ({
  data,
  nameKey,
  config,
  dataKey,
  title,
  description,
  type = "bar",
}: {
  data: { [key: string]: any }[];
  nameKey: keyof (typeof data)[0];
  config: ChartConfig;
  dataKey: keyof (typeof data)[0];
  title: string;
  description: string;
  type?: "pie" | "bar";
}) => {
  if (data.some((d) => d[nameKey] === undefined))
    console.error("NameKey not present in data passed to chart.");
  if (data.some((d) => d[dataKey] === undefined))
    console.error("DataKey not present in data passed to chart");

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
            <Bar dataKey={dataKey} fill="hsl(var(--chart-1))" radius={4} />
            {/* <Bar dataKey="played" fill="hsl(var(--chart-2))" radius={4} /> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
