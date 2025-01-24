"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  TooltipProps,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getAllSessions } from "../../../../../prisma/lib/admin";
import Image from "next/image";
import Link from "next/link";

const chartConfig = {
  id: {
    label: "Game Id",
  },
  desktop: {
    label: "Desktop",
    color: "",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Sessions = Awaited<ReturnType<typeof getAllSessions>>;

export function TimelineChart({ sessions }: { sessions: Sessions }) {
  const [session, setSession] = React.useState<Sessions[0]>();
  const handleSetSession = React.useCallback((session: Sessions[0]) => {
    setSession(session);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={sessions}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Tooltip
              content={<CustomTooltip setSession={handleSetSession} />}
            />
            <Line
              dataKey={"sessionId"}
              type="monotone"
              stroke={`hsl(var(--chart-1))`}
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
  setSession,
}: TooltipProps<any, any> & {
  setSession: (session: Sessions[0]) => void;
}) => {
  const session = payload?.at(0)?.payload as Sessions[0];
  React.useEffect(() => {
    if (active) {
      setSession(session);
    }
  }, [active, session, setSession]);

  if (active) {
    return (
      <div className="max-w-10 flex-wrap rounded-md p-2 shadow-md">
        <Card>
          <CardContent>
            <Image
              height={200}
              width={200}
              alt={session.sessionName}
              src={session.thumbnail}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
};
