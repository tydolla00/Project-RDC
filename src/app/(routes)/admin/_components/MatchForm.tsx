"use client";
import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import * as Toolbar from "@radix-ui/react-toolbar";
import PlayerStatForm from "./PlayerStatForm";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Player } from "@prisma/client";
import PlayerSelector from "./PlayerSelector";

// Need to get the game from Entry Creator/ Admin Form Hook
interface Props {
  matchPlayers: Player[] | null;
}

const MatchForm: React.FC<Props> = ({ matchPlayers }) => {
  const [matchWinners, setMatchWinners] = useState<Player[]>([]);
  console.log("Match Winners: ", matchWinners);

  const handleMatchPlayerClick = (player: Player) => {
    setMatchWinners((prevWinners) => {
      if (prevWinners.includes(player)) {
        return prevWinners.filter(
          (winner) => winner.playerId !== player.playerId,
        );
      } else {
        return [...prevWinners, player];
      }
    });
  };

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
        {matchPlayers?.map((player: Player, index: number) => (
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
          <PlayerSelector
            handlePlayerClick={handleMatchPlayerClick}
            referencePlayers={matchWinners}
            rdcMembers={matchPlayers ?? []}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MatchForm;