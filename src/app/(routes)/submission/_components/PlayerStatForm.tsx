import { GameStat } from "@prisma/client";
import React from "react";

interface Stat {
  name: string;
  value: string | number;
}

interface PlayerStatFormProps {
  stats: GameStat[];
}

const PlayerStatForm: React.FC<PlayerStatFormProps> = ({ stats }) => {
  return (
    <form>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {stats.map((stat, index) => (
          <div key={index} className="mx-2">
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
    </form>
  );
};

export default PlayerStatForm;
