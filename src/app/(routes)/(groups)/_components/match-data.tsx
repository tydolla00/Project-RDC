import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { RLStats } from "./timeline-chart";
import Link from "next/link";
import { getAllSessionsByGame } from "../../../../../prisma/lib/admin";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SetData from "./set-data";

type Sessions = Awaited<ReturnType<typeof getAllSessionsByGame>>;

const MatchData = ({ session }: { session: Sessions[0] | undefined }) => {
  const sets = useMemo(() => {
    const innerSets: RLStats[][][] = [];
    session?.sets.forEach((set) => {
      const setWinners = set.setWinners.map((p) => p.playerName);
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
                winners: setWinners,
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
  const [currentSet, setCurrentSet] = useState(0);
  console.log({ sets });
  return (
    <div className="my-6">
      <div className="my-4">
        {session ? (
          <div className="w-[300px]">
            <Link className="block" href={session?.sessionUrl}>
              <Image
                className="my-4"
                height={300}
                width={300}
                alt={session.sessionName}
                src={session.thumbnail}
              />
              <div className="my-4 hover:underline">{session.sessionName}</div>
            </Link>
            <div>Hover card from bottom</div>
          </div>
        ) : null}
      </div>
      {sets.length > 0 && (
        <>
          <div>
            <Button
              className="cursor-pointer"
              variant="ghost"
              disabled={currentSet === 0}
              onClick={() => setCurrentSet((curr) => curr - 1)}
            >
              Previous Set
            </Button>
            <Button
              className="cursor-pointer"
              variant="ghost"
              disabled={currentSet === sets.length - 1}
              onClick={() => setCurrentSet((curr) => curr + 1)}
            >
              Next Set
            </Button>
          </div>
          <SetData set={sets[currentSet]} setIndex={currentSet} />
          <div>
            <Button
              className="cursor-pointer"
              variant="ghost"
              disabled={currentSet === 0}
              onClick={() => setCurrentSet((curr) => curr - 1)}
            >
              Previous Set
            </Button>
            <Button
              className="cursor-pointer"
              variant="ghost"
              disabled={currentSet === sets.length - 1}
              onClick={() => setCurrentSet((curr) => curr + 1)}
            >
              Next Set
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default MatchData;
