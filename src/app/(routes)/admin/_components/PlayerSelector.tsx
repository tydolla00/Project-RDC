import { Player } from "@prisma/client";
import * as Avatar from "@radix-ui/react-avatar";
import React from "react";
interface Props {
  rdcMembers: Player[];
  selectedPlayers: number[] | null;
  setSelectedPlayers: React.Dispatch<React.SetStateAction<number[] | null>>;
}
const PlayerSelector = ({
  rdcMembers,
  selectedPlayers,
  setSelectedPlayers,
}: Props) => {
  const handlePlayerClick = (id: number) => {
    setSelectedPlayers((prevSelected) => {
      if (prevSelected === null) {
        return [id];
      }
      if (prevSelected.includes(id)) {
        return prevSelected.filter((playerId) => playerId !== id);
      }
      return [...prevSelected, id];
    });
  };

  return (
    <div className="flex flex-col items-center" id="player-selector-container">
      <div className="text-lg">Player Selector</div>
      <div className="mt-2 flex">
        {rdcMembers.map((player, index) => (
          <>
            <Avatar.Root
              className={`m-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                selectedPlayers?.includes(player.playerId)
                  ? "bg-blue-500"
                  : "bg-slate-400"
              }`}
              onClick={() => handlePlayerClick(player.playerId)}
              key={index}
            >
              <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                {player.playerName.slice(0, 2)}
              </Avatar.Fallback>
            </Avatar.Root>
          </>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelector;
