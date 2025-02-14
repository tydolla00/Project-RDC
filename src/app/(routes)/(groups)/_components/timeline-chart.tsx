"use client";

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
import { getAllSessionsByGame } from "../../../../../prisma/lib/admin";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import MatchData from "./match-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

type Sessions = Awaited<ReturnType<typeof getAllSessionsByGame>>;

export function TimelineChart({
  sessions,
  title,
  desc,
}: {
  sessions: Sessions;
  title: string;
  desc: string;
}) {
  const [session, setSession] = useState<Sessions[0]>();
  const handleSetSession = useCallback((session: Sessions[0]) => {
    setSession(session);
  }, []);
  const [showMatchData, setShowMatchData] = useState(true);

  return (
    <>
      <Card className="my-6">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </div>
          <div className="flex items-center justify-center gap-3 p-6">
            <Label htmlFor="showMatchData">Turn off hover effect</Label>
            <Switch
              id="showMatchData"
              onCheckedChange={(val) => {
                console.log(val);
                if (val) setSession(undefined);
                setShowMatchData(!val);
              }}
            />
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
                    year: "numeric",
                  });
                }}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    showMatchData={showMatchData}
                    setSession={handleSetSession}
                  />
                }
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
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        {session && (
          <Button
            className="cursor-pointer"
            onClick={() => setSession(undefined)}
          >
            Hide Match Data
          </Button>
        )}
        <MatchData session={session} />
      </Suspense>
    </>
  );
}

export type RLStats = {
  score: number;
  goals: number;
  assists: number;
  saves: number;
  shots: number;
  player: string;
  winners: string[];
};

// TODO Show session info about sets/matches.
const CustomTooltip = ({
  active,
  payload,
  label,
  setSession,
  showMatchData,
}: TooltipProps<any, any> & {
  setSession: (session: Sessions[0]) => void;
  showMatchData: boolean;
}) => {
  const session = payload?.at(0)?.payload as Sessions[0];
  useEffect(() => {
    if (active && showMatchData) {
      console.log(showMatchData);
      setSession(session);
    }
  }, [active, session, setSession]);

  if (active) {
    return (
      <div className="max-w-48 flex-wrap rounded-md p-2 shadow-md">
        <Card>
          <CardHeader>
            <CardTitle className="absolute">{session.sessionName}</CardTitle>
          </CardHeader>
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
