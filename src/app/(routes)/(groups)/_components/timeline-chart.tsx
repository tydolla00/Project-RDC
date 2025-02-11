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
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { H1, H2, H3 } from "@/components/headings";
import { cn } from "@/lib/utils";

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

  return (
    <>
      <Card className="my-6">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
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
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
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
};
const MatchData = ({ session }: { session: Sessions[0] | undefined }) => {
  const sets = useMemo(() => {
    const innerSets: RLStats[][][] = [];
    session?.sets.forEach((set) => {
      const setWinners = new Set(set.setWinners.map((p) => p.playerName));
      const innerSet: RLStats[][] = [];
      set.matches.forEach((match) => {
        const matchWinners = new Set(
          match.matchWinners.map((m) => m.playerName),
        );
        const innerMatch = new Map<string, RLStats>();
        match.playerSessions.forEach((ps) => {
          ps.playerStats.forEach(({ player, value, gameStat }) => {
            if (!innerMatch.has(player.playerName))
              innerMatch.set(player.playerName, {
                score: 0,
                goals: 0,
                assists: 0,
                saves: 0,
                shots: 0,
                player: player.playerName,
              });

            let innerPlayer = innerMatch.get(player.playerName)!;
            switch (gameStat.statName) {
              case "RL_SCORE":
                innerPlayer.score = Number(value);
                break;
              case "RL_GOALS":
                innerPlayer.goals = Number(value);
                break;
              case "RL_ASSISTS":
                innerPlayer.assists = Number(value);
                break;
              case "RL_SAVES":
                innerPlayer.saves = Number(value);
                break;
              case "RL_SHOTS":
                innerPlayer.shots = Number(value);
                break;
            }
          });
        });
        const matchData = Array.from(innerMatch, ([s, stats]) => ({
          ...stats,
        })).sort((a, b) => {
          if (matchWinners.has(a.player) && matchWinners.has(b.player))
            return b.score - a.score;
          else if (matchWinners.has(a.player)) return -1;
          else if (matchWinners.has(b.player)) return 1;
          else return b.score - a.score;
        });
        innerSet.push(matchData);
      });
      innerSets.push(innerSet);
    });
    return innerSets;
  }, [session]);
  console.log({ sets });
  return (
    <>
      {session && (
        <>
          <Link className="hover:underline" href={session.sessionUrl}>
            {session.sessionName}
          </Link>
          <Image
            height={200}
            width={200}
            alt={session.sessionName}
            src={session.thumbnail}
          />
        </>
      )}
      {sets.map((set, setIndex) => {
        return (
          <div key={setIndex} className="my-6">
            <div className="text-muted-foreground">Set {setIndex + 1}</div>
            {set.map((match, matchIndex) => {
              return (
                <div className="mb-4" key={matchIndex}>
                  <H3>Match {matchIndex + 1}</H3>
                  <div
                    className="grid gap-10"
                    style={{
                      gridTemplateColumns: "1fr 1fr",
                    }}
                  >
                    <Table>
                      <TableCaption></TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Player</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Goals</TableHead>
                          <TableHead>Assists</TableHead>
                          <TableHead>Saves</TableHead>
                          <TableHead>Shots</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {match.slice(0, 3).map((ps, i) => (
                          <TableRow
                            className={cn(i === 0 && "bg-amber-400")}
                            key={ps.player}
                          >
                            <TableCell>{ps.player}</TableCell>
                            <TableCell>{ps.score}</TableCell>
                            <TableCell>{ps.goals}</TableCell>
                            <TableCell>{ps.assists}</TableCell>
                            <TableCell>{ps.saves}</TableCell>
                            <TableCell>{ps.shots}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter></TableFooter>
                    </Table>
                    <Table>
                      <TableCaption></TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Player</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Goals</TableHead>
                          <TableHead>Assists</TableHead>
                          <TableHead>Saves</TableHead>
                          <TableHead>Shots</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {match.slice(3).map((ps) => (
                          <TableRow key={ps.player}>
                            <TableCell>{ps.player}</TableCell>
                            <TableCell>{ps.score}</TableCell>
                            <TableCell>{ps.goals}</TableCell>
                            <TableCell>{ps.assists}</TableCell>
                            <TableCell>{ps.saves}</TableCell>
                            <TableCell>{ps.shots}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter></TableFooter>
                    </Table>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

// TODO Show session info about sets/matches.
const CustomTooltip = ({
  active,
  payload,
  label,
  setSession,
}: TooltipProps<any, any> & {
  setSession: (session: Sessions[0]) => void;
}) => {
  const session = payload?.at(0)?.payload as Sessions[0];
  useEffect(() => {
    if (active) {
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
