import { GameStat, Player } from "@prisma/client";
import React from "react";
import PlayerAvatar from "../../admin/_components/PlayerAvatar";

interface PlayerStatFormProps {
  player: Player;
  stats: GameStat[];
}

const PlayerStatForm: React.FC<PlayerStatFormProps> = ({ player, stats }) => {
  return (
    <div className="flex flex-row items-center">
      <PlayerAvatar player={player} />
      {stats.map((stat, index) => (
        <div key={index} className="mx-2 flex flex-row items-center">
          <label className="block">{stat.statName}</label>
          <input
            type={typeof stat.type === "number" ? "number" : "text"}
            value={""}
            readOnly
            className="rounded border px-2 py-1"
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerStatForm;
