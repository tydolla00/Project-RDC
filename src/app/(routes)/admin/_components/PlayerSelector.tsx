"use client";
import { Player } from "@prisma/client";
import React, { useState } from "react";
import PlayerAvatar from "./PlayerAvatar";
import { useRouter } from "next/navigation";
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  useController,
  useFieldArray,
} from "react-hook-form";
import { z } from "zod";
import { formSchema, FormValues } from "./EntryCreatorForm";
interface Props {
  rdcMembers: Player[];
  referencePlayers?: Player[];
  handlePlayerClick?: (player: Player) => void;
  control?: Control<z.infer<typeof formSchema>>;
  fieldName?: string;
  field: ControllerRenderProps<FormValues>;
}
const PlayerSelector = ({
  handlePlayerClick,
  referencePlayers,
  rdcMembers,
  control,
  fieldName,
  field,
}: Props) => {
  // Should require this component to be wrapped in Controller?
  // make control and name required props?
  // Or refactor later

  const { fields, append, remove } = useFieldArray({
    control,
    name: "players",
  });

  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  // const { field, fieldState } = useController({
  //   control,
  //   name: "players",
  // });

  const reactHookFormHandlePlayerClick = (player: Player) => {
    const isSelected = selectedPlayers.some(
      (p) => p.playerId === player.playerId,
    );
    const updatedPlayers = isSelected
      ? selectedPlayers.filter((p) => p.playerId !== player.playerId)
      : [...selectedPlayers, player];

    setSelectedPlayers(updatedPlayers);
    field.onChange(updatedPlayers);
  };

  const getPlayerAvatarClassName = (player: Player) => {
    const isSelected = selectedPlayers.includes(player);
    const isReferencePlayer = referencePlayers?.some(
      (refPlayer) => refPlayer.playerId === player.playerId,
    );

    // If there is a reference player array, we want the bg to be a diff color whe selected but
    // still gray if not selected
    // if no reference player array default is blue background gray
    if (isReferencePlayer) {
      if (isSelected) {
        return "bg-green-500";
      } else {
        return "bg-slate-400";
      }
    } else {
      if (isSelected && isReferencePlayer == null) {
        return "bg-blue-500";
      } else {
        return "bg-slate-400";
      }
    }
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
              handleOnClick={
                handlePlayerClick
                  ? () => handlePlayerClick(player)
                  : () => reactHookFormHandlePlayerClick(player)
              }
              optionalClassName={`m-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${getPlayerAvatarClassName(
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
