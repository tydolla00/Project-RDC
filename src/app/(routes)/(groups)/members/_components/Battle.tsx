"use client";
import PlayerAvatar from "@/app/(routes)/admin/_components/form/PlayerAvatar";
import { PLAYER_MAPPINGS } from "@/app/(routes)/admin/_utils/player-mappings";
import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";

export const Battle = () => {
  return (
    <div className="grid h-72 grid-cols-2">
      <div>
        <div className="size-72 border border-gray-400 bg-slate-900" />
        <Players />
      </div>
      <div>
        <div className="size-72 border border-gray-400 bg-slate-900" />
        <Players />
      </div>
      {/* <Separator orientation="vertical" /> */}
    </div>
  );
};

export const Players = () => {
  const players = Object.keys(PLAYER_MAPPINGS);

  return (
    <div className="grid w-1/2 grid-cols-3">
      {players.map((name) => (
        <Card
          className="h-fit w-fit border transition-colors duration-200 hover:dark:border-purple-700"
          key={name}
        >
          <PlayerAvatar
            optionalClassName="size-16"
            player={{ playerId: 1, playerName: name }}
          />
        </Card>
      ))}
    </div>
  );
};
