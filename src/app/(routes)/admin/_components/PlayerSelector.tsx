import { Player } from "@prisma/client";
import * as Avatar from "@radix-ui/react-avatar";
import React from "react";
import PlayerAvatar from "./PlayerAvatar";
interface Props {
  rdcMembers: Player[];
  selectedPlayers: Player[] | null;
  setSelectedPlayers: React.Dispatch<React.SetStateAction<Player[] | null>>;
}
const PlayerSelector = ({
  rdcMembers,
  selectedPlayers,
  setSelectedPlayers,
}: Props) => {
  const handlePlayerClick = (player: Player) => {
    console.log("Handle Player Click", player);
    setSelectedPlayers((prevSelected) => {
      if (prevSelected === null) {
        return [player];
      }
      if (prevSelected.some((p) => p.playerId === player.playerId)) {
        return prevSelected.filter((p) => p.playerId !== player.playerId);
      }
      return [...prevSelected, player];
    });
  };

  return (
    <div className="flex flex-col items-center" id="player-selector-container">
      <div className="text-lg underline">Player Selector</div>
      {rdcMembers.length !== 0 ? (
        <div className="mt-2 flex">
          {rdcMembers.map((player, index) => (
            <PlayerAvatar
              key={index}
              player={player}
              handleOnClick={() => handlePlayerClick(player)}
              optionalClassName={`m-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
                selectedPlayers?.includes(player)
                  ? "bg-blue-500"
                  : "bg-slate-400"
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="text-md">No Players in this context</div>
      )}
    </div>
  );
};

export default PlayerSelector;

/**
 * 
 * `m-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
              selectedPlayers?.includes(player) ? "bg-blue-500" : "bg-slate-400"
            }`
 */
