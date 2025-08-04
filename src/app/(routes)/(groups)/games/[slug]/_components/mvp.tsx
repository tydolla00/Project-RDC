import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QueryResponseData } from "prisma/db";
import { getAllSessionsByGame } from "prisma/lib/admin";
import { useMemo } from "react";

type Sessions = QueryResponseData<
  Awaited<ReturnType<typeof getAllSessionsByGame>>
>;

export const MVP = ({ session }: { session: Sessions[0] }) => {
  const playerId = 1; // For example purposes

  const processStats = useMemo((): ProcessedStats => {
    const stats = getInitialStats(session.Game.gameName);
    let foundPlayerName: string | undefined;

    // Process session data
    // Process session data and collect stats
    session.sets.forEach((set) => {
      set.matches.forEach((match) => {
        stats.matches++;
        match.playerSessions.forEach((pSession) => {
          pSession.playerStats.forEach((pStat) => {
            if (pStat.player.playerId === playerId) {
              if (!foundPlayerName) {
                foundPlayerName = pStat.player.playerName;
              }
              const value = Number(pStat.value);
              switch (pStat.gameStat.statName) {
                // Rocket League Stats
                case "RL_GOALS":
                  stats.goals = (stats.goals || 0) + value;
                  break;
                case "RL_ASSISTS":
                  stats.assists = (stats.assists || 0) + value;
                  break;
                case "RL_SAVES":
                  stats.saves = (stats.saves || 0) + value;
                  break;
                case "RL_SHOTS":
                  stats.shots = (stats.shots || 0) + value;
                  break;
                // Mario Kart Stats
                case "MK8_POS":
                  stats.totalPositions = (stats.totalPositions || 0) + value;
                  break;
                // Call of Duty Stats
                case "COD_KILLS":
                  stats.kills = (stats.kills || 0) + value;
                  break;
                case "COD_DEATHS":
                  stats.deaths = (stats.deaths || 0) + value;
                  break;
                case "COD_SCORE":
                  stats.score = (stats.score || 0) + value;
                  break;
                case "COD_MELEES":
                  stats.melees = (stats.melees || 0) + value;
                  break;
                // Lethal Company Stats
                case "LC_DEATHS":
                  stats.deaths = (stats.deaths || 0) + value;
                  break;
                // Speedrunners Stats
                case "SR_WINS":
                  stats.wins = (stats.wins || 0) + value;
                  break;
                case "SR_SETS":
                  stats.setWins = (stats.setWins || 0) + value;
                  break;
              }
            }
          });
        });
      });
    });

    const displayStats = getDisplayStats(stats, session.Game.gameName);
    const avgStats = getAverageStats(displayStats, stats.matches);

    return {
      gameStats: stats,
      playerName: foundPlayerName,
      displayStats,
      avgStats,
    };
  }, [session, playerId]);

  const { playerName, gameStats, displayStats, avgStats } = processStats;

  return (
    <Card className="relative overflow-hidden">
      <div className="from-primary/10 absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l to-transparent" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          MVP
          {session.dayWinners.some((p) => p.playerName === playerName) && (
            <span className="bg-primary/20 rounded-full px-2 py-1 text-xs">
              Session Winner
            </span>
          )}
        </CardTitle>
        <CardDescription>Match Statistics</CardDescription>
      </CardHeader>
      <CardContent>
        {playerName ? (
          <div className="relative space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="border-primary/20 h-16 w-16 border-2">
                <AvatarImage
                  src={`/images/${playerName.toLowerCase()}_rdc.jpg`}
                  alt={playerName}
                />
                <AvatarFallback>{playerName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{playerName}</h3>
                <p className="text-muted-foreground text-sm">
                  {gameStats.matches} matches played
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(displayStats).map(([key, value]) => (
                <div key={key} className="bg-muted space-y-1 rounded-lg p-3">
                  <p className="text-sm font-medium">{key}</p>
                  <p className="text-2xl font-bold tracking-tight">{value}</p>
                  <p className="text-muted-foreground text-xs">
                    {avgStats[key]} per game
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No data available for this player in this session.</p>
        )}
      </CardContent>
    </Card>
  );
};

type GameStats = {
  matches: number;
  goals?: number;
  assists?: number;
  saves?: number;
  shots?: number;
  totalPositions?: number;
  avgPosition?: number;
  kills?: number;
  deaths?: number;
  score?: number;
  melees?: number;
  wins?: number;
  setWins?: number;
};

type DisplayStats = {
  [key: string]: string | number;
};

type ProcessedStats = {
  gameStats: GameStats;
  playerName: string | undefined;
  displayStats: DisplayStats;
  avgStats: Record<string, string>;
};

const getInitialStats = (gameName: string): GameStats => {
  switch (gameName) {
    case "Rocket League":
      return {
        matches: 0,
        goals: 0,
        assists: 0,
        saves: 0,
        shots: 0,
      };
    case "Mario Kart 8":
      return {
        matches: 0,
        avgPosition: 0,
        totalPositions: 0,
      };
    case "Call of Duty":
      return {
        matches: 0,
        kills: 0,
        deaths: 0,
        score: 0,
        melees: 0,
      };
    case "Lethal Company":
      return {
        matches: 0,
        deaths: 0,
      };
    case "Speedrunners":
      return {
        matches: 0,
        wins: 0,
        setWins: 0,
      };
    default:
      return { matches: 0 };
  }
};

const getDisplayStats = (stats: GameStats, gameName: string): DisplayStats => {
  const { matches } = stats;
  switch (gameName) {
    case "Rocket League": {
      return {
        Goals: stats.goals || 0,
        Assists: stats.assists || 0,
        Saves: stats.saves || 0,
        Shots: stats.shots || 0,
      };
    }
    case "Mario Kart 8": {
      const avgPosition = ((stats.totalPositions || 0) / matches).toFixed(1);
      return {
        "Avg Position": avgPosition,
      };
    }
    case "Call of Duty": {
      const kills = stats.kills || 0;
      const deaths = stats.deaths || 0;
      return {
        Kills: kills,
        Deaths: deaths,
        "K/D": (kills / Math.max(deaths, 1)).toFixed(2),
        Score: stats.score || 0,
      };
    }
    case "Lethal Company": {
      return {
        Deaths: stats.deaths || 0,
      };
    }
    case "Speedrunners": {
      const wins = stats.wins || 0;
      return {
        "Win Rate": ((wins / matches) * 100).toFixed(1) + "%",
        "Set Wins": stats.setWins || 0,
      };
    }
    default:
      return {};
  }
};

const getAverageStats = (
  stats: DisplayStats,
  matches: number,
): Record<string, string> => {
  const avgStats: Record<string, string> = {};

  Object.entries(stats).forEach(([key, value]) => {
    if (typeof value === "number") {
      avgStats[key] = (value / matches).toFixed(1);
    } else {
      avgStats[key] = "N/A";
    }
  });

  return avgStats;
};
