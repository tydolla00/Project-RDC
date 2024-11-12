import { Player } from "@prisma/client";
import React, { useState } from "react";
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "10px",
        }}
      >
        {rdcMembers.map((player, index) => (
          <div
            className="mx-1 flex items-center justify-center"
            key={index}
            onClick={() => handlePlayerClick(index + 1)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: selectedPlayers?.includes(index + 1)
                ? "blue"
                : "gray",
              cursor: "pointer",
            }}
          >
            {player.playerName.slice(0, 2)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelector;
