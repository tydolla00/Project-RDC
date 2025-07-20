import { useMemo, useState } from "react";
import { RLStats } from "../../../_components/timeline-chart";
import { getAllSessionsByGame } from "../../../../../../../prisma/lib/admin";
import SetData from "./set-data";
import { QueryResponseData } from "../../../../../../../prisma/db";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Sessions = QueryResponseData<
  Awaited<ReturnType<typeof getAllSessionsByGame>>
>;

const MatchData = ({ session }: { session: Sessions[0] | undefined }) => {
  const sets = useMemo(() => {
    if (!session) return [];
    return getSetsData(session);
  }, [session]);
  const [currentSet, setCurrentSet] = useState(0);

  return (
    <div className="my-6">
      {sets.length > 0 && (
        <>
          <SetNavigation
            currentSet={currentSet}
            setCurrentSet={setCurrentSet}
            maxSets={sets.length}
          />
          <SetData
            set={sets[currentSet]}
            setIndex={currentSet}
            game={session?.Game.gameName}
          />
          <SetNavigation
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

const SetNavigation = ({
  currentSet,
  setCurrentSet,
  maxSets,
}: {
  currentSet: number;
  setCurrentSet: React.Dispatch<React.SetStateAction<number>>;
  maxSets: number;
}) => {
  const getSetNumbers = () => {
    const numbers: (number | "...")[] = [];
    const currentPage = currentSet + 1;
    const totalPages = maxSets;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    numbers.push(1);

    if (currentPage <= 3) {
      numbers.push(2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      numbers.push("...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      numbers.push(
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }

    return numbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentSet > 0 && setCurrentSet((curr) => curr - 1)}
            className={
              currentSet === 0
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {getSetNumbers().map((setNumber, index) => {
          if (setNumber === "...") {
            return (
              <PaginationItem
                className="cursor-pointer"
                key={`ellipsis-${index}`}
              >
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={setNumber}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => setCurrentSet(setNumber - 1)}
                isActive={currentSet === setNumber - 1}
              >
                {setNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentSet < maxSets - 1 && setCurrentSet((curr) => curr + 1)
            }
            className={
              currentSet === maxSets - 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

const getSetsData = (session: Sessions[0]) => {
  switch (session.Game.gameName) {
    case "Rocket League": {
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
          const matchData = Array.from(innerMatch, ([_, stats]) => ({
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
    }
    case "Mario Kart 8": {
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
    }
    default:
      return [];
  }
};
