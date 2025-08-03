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
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { getAllSessionsByGame } from "../../../../../../../prisma/lib/admin";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import MatchData from "./match-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { gameImages } from "@/lib/constants";
import { QueryResponseData } from "../../../../../../../prisma/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MVP } from "./mvp";

const chartConfig = {
  id: {
    label: "Game Id",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Sessions = QueryResponseData<
  Awaited<ReturnType<typeof getAllSessionsByGame>>
>;

export function TimelineChart({
  sessions,
  title,
  desc,
  gameName,
}: {
  sessions: Sessions;
  title: string;
  desc: string;
  gameName: keyof typeof gameImages;
}) {
  const [session, setSession] = useState<Sessions[0]>();
  const handleSetSession = useCallback((session: Sessions[0]) => {
    setSession(session);
  }, []);
  const [showMatchData, setShowMatchData] = useState(true);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={`/images/${gameImages[gameName]}`}
              alt={gameName}
            />
            <AvatarFallback>{gameName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{desc}</p>
          </div>
        </div>

        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          {session && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <Link
                  href={session?.sessionUrl}
                  className="group block overflow-hidden rounded-lg"
                >
                  <Image
                    className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                    height={400}
                    width={600}
                    alt={session.sessionName}
                    src={session.thumbnail}
                  />
                  <div className="mt-4 font-medium group-hover:underline">
                    {session.sessionName}
                  </div>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Show Session Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="h-screen max-w-3xl">
                    <DialogHeader className="space-y-0">
                      <DialogTitle>Session Info</DialogTitle>
                      <DialogDescription>
                        Explore the info about this video
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[80vh]">
                      <MatchData session={session} />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
              <MVP session={session} />
            </div>
          )}
        </Suspense>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </div>
          <div className="flex items-center justify-center gap-3 p-6">
            <Label htmlFor="showMatchData">Disable hover effects</Label>
            <Switch
              id="showMatchData"
              onCheckedChange={(val) => {
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
                stroke={`var(--chart-1)`}
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
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
  }, [active, session, setSession, showMatchData]);

  if (active) {
    return (
      <div className="max-w-48 flex-wrap rounded-md p-2 shadow-md">
        <Card>
          <CardHeader>
            <CardTitle className="absolute">{session.sessionName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              className="h-auto w-auto"
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
