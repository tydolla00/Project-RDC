import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import * as Toolbar from "@radix-ui/react-toolbar";
import PlayerStatForm from "./PlayerStatForm";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { GameStat, Player } from "@prisma/client";
import PlayerSelector from "../../admin/_components/PlayerSelector";

// Need to get the game from Entry Creator/ Admin Form Hook
interface Props {
  players: Player[] | null;
}

const MatchForm: React.FC<Props> = ({ players }) => {
  return (
    <Collapsible className="m-2 w-full">
      <CollapsibleTrigger asChild className="w-full">
        <Toolbar.Root className="rounded-t-md bg-gray-200 p-4 dark:bg-gray-900">
          <Toolbar.ToggleGroup type="single">
            <Toolbar.ToggleItem
              className="flex w-full flex-row items-center justify-between"
              value="toolbar"
            >
              Match Information
              <ChevronDownIcon className="" aria-hidden />
            </Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
        </Toolbar.Root>
      </CollapsibleTrigger>
      <CollapsibleContent className="rounded-b-md bg-gray-100 p-4 dark:bg-gray-800">
        Match Content
        {players?.map((player: Player, index: number) => (
          <PlayerStatForm
            key={index}
            player={player}
            stats={[
              {
                statId: 1,
                statName: "Stat 1",
                gameId: 0,
                type: null,
              },
            ]}
          />
        ))}
        <div
          className="flex flex-col items-center"
          id="match-winner-selector-container"
        >
          Match Winner
          <PlayerSelector rdcMembers={players ?? []} selectedPlayers={[]} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MatchForm;
