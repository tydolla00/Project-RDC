import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlayerAvatarProps {
  player: Player;
  optionalClassName?: string;
  handleOnClick?: () => void;
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
      ["Lee", "leland_rdc.jpg"],
      ["Des", "desmond_rdc.jpg"],
      ["John", "john_rdc.jpg"],
      ["Aff", "aff_rdc.jpg"],
      ["Ipi", "ipi_rdc.jpg"],
    ]);

    console.log("Player Avatar Map: ", playerAvatarMap.get(playerName));
    return playerAvatarMap.get(playerName) || "default_avatar.jpg";
  };

  const avatarSrc = `/images/${avatarHelperFunction(player.playerName)}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar
            className={
              optionalClassName
                ? optionalClassName
                : `m-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-300`
            }
            onClick={handleOnClick}
          >
            <AvatarImage src={avatarSrc} alt={player.playerName} />
            <AvatarFallback className="AvatarFallback" delayMs={200}>
              {player.playerName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent className="dark:bg-purple-700 dark:text-white">
          <p>{player.playerName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PlayerAvatar;
