import { Separator } from "@/components/ui/separator";
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

// Accepts either RLStats[][] or MarioKartStats[][]
type RLStats = import("./timeline-chart").RLStats;
type MarioKartStats = { player: string; position: number; winners: string[] };

type StatsType = RLStats | MarioKartStats;

type SetDataProps = {
  set: StatsType[][];
  setIndex: number;
  game: string | undefined;
};

const SetData = ({ set, setIndex, game }: SetDataProps) => (
  <div className="mb-6">
    <div className="text-chart-4 text-2xl font-bold">Set {setIndex + 1}</div>
    <div className="text-muted-foreground my-2 text-sm">
      Winners: {set.at(0)?.at(0)?.winners?.join(", ") || "No winners recorded"}
    </div>
    {set.map((match, matchIndex) => {
      return (
        <div className="mb-4" key={matchIndex}>
          <div>Match {matchIndex + 1}</div>
          <Separator className="my-2" />
          <span className="text-muted-foreground text-sm">Winning Team</span>
          <div className="flex gap-10 text-white">
            {game === "Rocket League" ? (
              <>
                <StatsTable players={match.slice(0, 3)} bgColor="bg-blue-700" />
                <StatsTable players={match.slice(3)} bgColor="bg-orange-700" />
              </>
            ) : (
              <StatsTable players={match} bgColor="bg-blue-700" />
            )}
          </div>
        </div>
      );
    })}
  </div>
);
export default SetData;

const StatsTable = ({
  players,
  bgColor,
}: {
  players: StatsType[];
  bgColor: string;
}) => {
  if (!players.length) return null;
  // Detect type by checking for 'score' property
  const isRocketLeague = (p: StatsType): p is RLStats =>
    typeof (p as RLStats).score === "number";

  return (
    <Table className="max-w-sm">
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          {isRocketLeague(players[0]) ? (
            <>
              <TableHead>Score</TableHead>
              <TableHead>Goals</TableHead>
              <TableHead>Assists</TableHead>
              <TableHead>Saves</TableHead>
              <TableHead>Shots</TableHead>
            </>
          ) : (
            <TableHead>Position</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className={bgColor}>
        {players.map((ps) => (
          <TableRow key={ps.player}>
            <TableCell>{ps.player}</TableCell>
            {isRocketLeague(ps) ? (
              <>
                <TableCell>{ps.score}</TableCell>
                <TableCell>{ps.goals}</TableCell>
                <TableCell>{ps.assists}</TableCell>
                <TableCell>{ps.saves}</TableCell>
                <TableCell>{ps.shots}</TableCell>
              </>
            ) : (
              <TableCell>{(ps as MarioKartStats).position}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
};
