import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MembersEnum } from "@/lib/constants";
import { capitalizeFirst } from "@/lib/utils";

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
    const playerAvatarMap = new Map<MembersEnum, string>([
      [capitalizeFirst(MembersEnum.Mark), "mark_rdc.jpg"],
      [capitalizeFirst(MembersEnum.Dylan), "dylan_rdc.jpg"],
      [capitalizeFirst(MembersEnum.Ben), "ben_rdc.jpg"],
      [capitalizeFirst(MembersEnum.Lee), "leland_rdc.jpg"],
      [capitalizeFirst(MembersEnum.Des), "desmond_rdc.jpg"],
      [capitalizeFirst(MembersEnum.John), "john_rdc.jpg"],
      [capitalizeFirst(MembersEnum.Aff), "aff_rdc.jpg"],
      [capitalizeFirst(MembersEnum.Ipi), "ipi_rdc.jpg"],
    ]);

    return (
      playerAvatarMap.get(playerName as MembersEnum) || "default_avatar.jpg"
    );
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
            <AvatarFallback className="AvatarFallback">
              {player.playerName.slice(0, 2)}
            </AvatarFallback>
            <AvatarImage
              src={avatarSrc}
              alt={player.playerName}
              onLoadingStatusChange={(status) => {
                if (status === "loaded") {
                  // Image is ready
                }
              }}
            />
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
