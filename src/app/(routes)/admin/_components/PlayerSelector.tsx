import { Player } from "@prisma/client";
import React, { useState } from "react";
interface Props {
  rdcMembers: Player[];
}
const PlayerSelector = ({ rdcMembers }: Props) => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const handlePlayerClick = (id: number) => {
    setSelectedPlayer(id);
  };

  return (
    <div>
      <select>
        {[...Array(8)].map((_, index) => (
          <option key={index} value={index + 1}>
            Player {index + 1}
          </option>
        ))}
      </select>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "10px",
        }}
      >
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            onClick={() => handlePlayerClick(index + 1)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: selectedPlayer === index + 1 ? "blue" : "gray",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerSelector;
