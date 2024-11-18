"use client";
import { Player } from "@prisma/client";
import React, { useState } from "react";
import PlayerAvatar from "./PlayerAvatar";
interface Props {
  rdcMembers: Player[];
}
const PlayerSelector = ({ rdcMembers }: Props) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[] | null>(null);

  const handlePlayerClick = (player: Player) => {
    if (setSelectedPlayers === undefined) return;
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
    <div
      className="flex flex-col items-center rounded-md border p-4"
      id="player-selector-container"
    >
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
        <div className="text-md">No Players in this context!</div>
      )}
    </div>
  );
};

export default PlayerSelector;
