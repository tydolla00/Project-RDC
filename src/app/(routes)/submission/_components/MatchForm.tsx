import React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Toolbar from "@radix-ui/react-toolbar";
import PlayerStatForm from "./PlayerStatForm";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Player } from "@prisma/client";

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
}

const MatchForm: React.FC<Props> = ({ players }) => {
  return (
    <Collapsible.Root className="m-2 w-full">
      <Collapsible.Trigger asChild className="w-full">
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
      </Collapsible.Trigger>
      <Collapsible.Content className="rounded-b-md bg-gray-100 p-4 dark:bg-gray-800">
        Match Content
        {players?.map((player: Player, index: number) => (
          <PlayerStatForm
            key={index}
            player={player}
            stats={[
              {
                statName: "MK_POS",
                statId: 0,
                gameId: 0,
                type: "Number",
              },
              {
                statName: "MK_POS_TEST",
                statId: 0,
                gameId: 0,
                type: "Number",
              },
            ]}
          />
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default MatchForm;
