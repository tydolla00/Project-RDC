"use client";
import PlayerAvatar from "@/app/(routes)/admin/_components/form/PlayerAvatar";
import { PLAYER_MAPPINGS } from "@/app/(routes)/admin/_utils/player-mappings";
import Image from "next/image";
import BattleBackground from "public/images/battle_background.png";

export const Battle = () => {
  return (
    <div className="w-full">
      {/* Full-width battle background image */}
      <div className="relative w-full">
        <Image
          src={BattleBackground}
          alt="Battle Background"
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      {/* Players grid below */}
      <div className="mx-auto mt-8 grid w-fit grid-cols-3 gap-8">
        <Players />
      </div>
    </div>
  );
};

export const Players = () => {
  const players = Object.keys(PLAYER_MAPPINGS);

  return (
    <>
      {players.map((name) => (
        <PlayerAvatar
          key={name}
          optionalClassName="size-16"
          player={{ playerId: 1, playerName: name }}
        />
      ))}
    </>
  );
};
