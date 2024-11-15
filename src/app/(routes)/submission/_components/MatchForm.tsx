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

/**
 * 
 * ____               _                 _      ____      
 / ___|_ __ __ _ ___| |__   ___  _   _| |_   / ___|___  
| |   | '__/ _` / __| '_ \ / _ \| | | | __| | |   / _ \ 
| |___| | | (_| \__ \ | | | (_) | |_| | |_  | |__| (_)|
\____|_|  \__,_|___/_| |_|\___/ \__,_|\__|  \____\___/ 
                                                        

 */

// Need to get the game from Entry Creator/ Admin Form Hook
interface Props {
  players: Player[] | null; // Define the type of players according to your needs
  getGameStats: (gameId: number) => Promise<GameStat[]>;
}

const MatchForm: React.FC<Props> = ({ players, getGameStats }) => {
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
        {players?.map(async (player: Player, index: number) => (
          <PlayerStatForm
            key={index}
            player={player}
            stats={await getGameStats(1)}
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
