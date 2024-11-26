import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Player } from "@prisma/client";

interface PlayerAvatarProps {
  player: Player;

  handleOnClick?: () => void;
  optionalClassName?: string;
}

const PlayerAvatar = ({
  player,
  handleOnClick,
  optionalClassName,
}: PlayerAvatarProps) => {
  const avatarHelperFunction = (playerName: string) => {
    const playerAvatarMap = new Map<string, string>([
      ["Mark", "mark_rdc.jpg"],
      ["Dylan", "dylan_rdc.jpg"],
      ["Ben", "ben_rdc.jpg"],
      ["Leland", "leland_rdc.jpg"],
      ["Des", "des_rdc.jpg"],
      ["John", "john_rdc.jpg"],
      ["Aff", "aff_rdc.jpg"],
      ["Ipi", "ipi_rdc.jpg"],
    ]);

    console.log("Player Avatar Map: ", playerAvatarMap.get(playerName));
    return playerAvatarMap.get(playerName) || "default_avatar.jpg";
  };

  const avatarSrc = `/images/${avatarHelperFunction(player.playerName)}`;

  return (
    <Avatar.Root
      className={
        optionalClassName
          ? optionalClassName
          : `m-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-300`
      }
      onClick={handleOnClick}
    >
      <Avatar.Image
        className="rounded-full"
        src={avatarSrc}
        alt={player.playerName}
      />
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-center text-xs text-white opacity-0 hover:opacity-100">
        {player.playerName}
      </div>
      <Avatar.Fallback className="AvatarFallback" delayMs={200}>
        {player.playerName.slice(0, 2)}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};

export default PlayerAvatar;
