import { H1 } from "@/components/headings";
import { getAllGameStats } from "../../../../../../prisma/lib/games";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statDescriptions } from "@/lib/stat-configs";

export default async function Page() {
  const stats = await getAllGameStats();
  return (
    <div>
      <H1>Update Database</H1>
      <div>Add Game</div>
      <div className="text-muted-foreground my-2 text-sm">Add Game Stat</div>
      <Select>
        <SelectTrigger className="max-w-sm">
          <SelectValue placeholder="Select a stat" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cod</SelectLabel>
            {stats.map((stat) => (
              <SelectItem key={stat.statId} value={stat.statName}>
                {statDescriptions[stat.statName]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div>Add Player</div>
    </div>
  );
}
