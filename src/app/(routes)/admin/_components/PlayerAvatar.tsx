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
  return (
    <Avatar.Root
      className={
        optionalClassName
          ? optionalClassName
          : `m-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-300`
      }
      onClick={handleOnClick}
    >
      <Avatar.Fallback className="AvatarFallback" delayMs={200}>
        {player.playerName.slice(0, 2)}
      </Avatar.Fallback>
    </Avatar.Root>
  );
};

export default PlayerAvatar;
