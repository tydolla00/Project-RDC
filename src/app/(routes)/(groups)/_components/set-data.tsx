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
import { RLStats } from "./timeline-chart";

const SetData = ({ set, setIndex }: { set: RLStats[][]; setIndex: number }) => (
  <div className="mb-6">
    <div className="text-muted-foreground font-light">Set {setIndex + 1}</div>
    {set.map((match, matchIndex) => {
      return (
        <div className="mb-4" key={matchIndex}>
          <div>Match {matchIndex + 1}</div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <span>Winning Team</span>
            <span>Losing Team</span>
          </div>
          <div className="flex gap-10 text-white">
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
              <TableBody className="bg-blue-700">
                {match.slice(0, 3).map((ps, i) => (
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
              <TableBody className="bg-orange-700">
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
export default SetData;
