"use client";
import { Player } from "@prisma/client";
import React, { useState } from "react";
import PlayerAvatar from "./PlayerAvatar";
import { Control, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { formSchema, FormValues } from "./EntryCreatorForm";
interface Props {
  rdcMembers: Player[];
  handlePlayerClick?: (player: Player) => void;
  control?: Control<z.infer<typeof formSchema>>;
  fieldName?: string;
  field: ControllerRenderProps<FormValues>;
}
const PlayerSelector = ({ handlePlayerClick, rdcMembers, field }: Props) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const reactHookFormHandlePlayerClick = (player: Player): void => {
    console.log("Handling react hook form player click");
    const isSelected = selectedPlayers.some(
      (p) => p.playerId === player.playerId,
    );
    const updatedPlayers = isSelected
      ? selectedPlayers.filter((p) => p.playerId !== player.playerId)
      : [...selectedPlayers, player];

    setSelectedPlayers(updatedPlayers);
    field.onChange(updatedPlayers);
  };

  const getPlayerAvatarClassName = (player: Player): string => {
    const isSelected = selectedPlayers.includes(player);
    if (isSelected) {
      return "border-2 border-purple-700";
    } else {
      return "";
    }
  };

  return (
    <div
      className="flex flex-col items-center rounded-md border p-4"
      id="player-selector-container"
    >
      {rdcMembers?.length !== 0 ? (
        <div className="mt-2 flex">
          {rdcMembers?.map((player, index) => (
            <PlayerAvatar
              key={index}
              player={player}
              handleOnClick={
                handlePlayerClick
                  ? () => handlePlayerClick(player)
                  : () => reactHookFormHandlePlayerClick(player)
              }
              optionalClassName={`m-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ${getPlayerAvatarClassName(
                player,
              )}`}
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
