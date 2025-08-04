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
import { RLStats } from "../games/[slug]/_components/timeline-chart";

// TODO Show Set Results - Who Won and what was the score.
const SetData = ({ set, setIndex }: { set: RLStats[][]; setIndex: number }) => (
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
            <StatsTable players={match.slice(0, 3)} bgColor="bg-blue-700" />
            <StatsTable players={match.slice(3)} bgColor="bg-orange-700" />
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
  players: RLStats[];
  bgColor: string;
}) => (
  <Table className="max-w-sm">
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
    <TableBody className={bgColor}>
      {players.map((ps) => (
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
);
