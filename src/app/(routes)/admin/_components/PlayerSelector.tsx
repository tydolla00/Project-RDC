"use client";
import { Player } from "@prisma/client";
import React, { useEffect, useState } from "react";
import PlayerAvatar from "./PlayerAvatar";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
interface Props {
  rdcMembers: Player[];
}
const PlayerSelector = ({ rdcMembers }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Do we need to debounce?

  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const selectedPlayerIds = searchParams.get("selectedPlayers");
    if (selectedPlayerIds) {
      const ids = selectedPlayerIds.split(",").map(Number);
      const initialSelectedPlayers = rdcMembers.filter((player) =>
        ids.includes(player.playerId),
      );
      setSelectedPlayers(initialSelectedPlayers);
    }
  }, [searchParams, rdcMembers]);

  const handlePlayerClick = (player: Player) => {
    const isSelected = selectedPlayers.some(
      (p) => p.playerId === player.playerId,
    );
    const updatedPlayers = isSelected
      ? selectedPlayers.filter((p) => p.playerId !== player.playerId)
      : [...selectedPlayers, player];

    setSelectedPlayers(updatedPlayers);

    const updatedPlayerIds = updatedPlayers.map((p) => p.playerId).join(",");
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("selectedPlayers", updatedPlayerIds);
    router.push(`?${newSearchParams.toString()}`);
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
