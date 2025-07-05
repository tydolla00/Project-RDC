import { useMemo, useState } from "react";
import { RLStats } from "./timeline-chart";
import { getAllSessionsByGame } from "../../../../../prisma/lib/admin";
import { Button } from "@/components/ui/button";
import SetData from "./set-data";
import { QueryResponseData } from "../../../../../prisma/db";

type Sessions = QueryResponseData<
  Awaited<ReturnType<typeof getAllSessionsByGame>>
>;

const MatchData = ({ session }: { session: Sessions[0] | undefined }) => {
  const sets = useMemo(() => {
    if (!session) return [];
    return getSetsData(session);
  }, [session]);
  const [currentSet, setCurrentSet] = useState(0);
  console.log({ sets });
  return (
    <div className="my-6">
      {sets.length > 0 && (
        <>
          <NavigationButtons
            currentSet={currentSet}
            setCurrentSet={setCurrentSet}
            maxSets={sets.length}
          />
          <SetData
            set={sets[currentSet]}
            setIndex={currentSet}
            game={session?.Game.gameName}
          />
          <NavigationButtons
            currentSet={currentSet}
            setCurrentSet={setCurrentSet}
            maxSets={sets.length}
          />
        </>
      )}
    </div>
  );
};
export default MatchData;

const NavigationButtons = ({
  currentSet,
  setCurrentSet,
  maxSets,
}: {
  currentSet: number;
  setCurrentSet: React.Dispatch<React.SetStateAction<number>>;
  maxSets: number;
}) => (
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
      disabled={currentSet === maxSets - 1}
      onClick={() => setCurrentSet((curr) => curr + 1)}
    >
      Next Set
    </Button>
  </div>
);

const getSetsData = (session: Sessions[0]) => {
  switch (session.Game.gameName) {
    case "Rocket League":
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
    case "Mario Kart 8":
      type MarioKartStats = {
        player: string;
        position: number;
        winners: string[];
      };
      const mkSets: MarioKartStats[][][] = [];
      session?.sets.forEach((set) => {
        const setWinners = set.setWinners.map((p) => p.playerName);
        const innerSet: MarioKartStats[][] = [];
        set.matches.forEach((match) => {
          const matchWinners = new Set(
            match.matchWinners.map((m) => m.playerName),
          );
          const innerMatch = new Map<string, MarioKartStats>();
          match.playerSessions.forEach((ps) => {
            ps.playerStats.forEach(({ player, value, gameStat }) => {
              if (!innerMatch.has(player.playerName))
                innerMatch.set(player.playerName, {
                  position: 0,
                  player: player.playerName,
                  winners: setWinners,
                });

              let innerPlayer = innerMatch.get(player.playerName)!;
              switch (gameStat.statName) {
                case "MK8_POS":
                  innerPlayer.position = Number(value);
                  break;
              }
            });
          });
          const matchData = Array.from(innerMatch, ([, stats]) => ({
            ...stats,
          })).sort((a, b) => a.position - b.position);
          innerSet.push(matchData);
        });
        mkSets.push(innerSet);
      });
      return mkSets;
    default:
      return [];
  }
};
