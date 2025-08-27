import { PLAYER_MAPPINGS } from "@/app/(routes)/admin/_utils/player-mappings";
import { VisionResultCodes } from "./constants";
import { PlayerStat } from "@prisma/client";

export interface VisionResult {
  players: VisionPlayer[];
  winner?: VisionPlayer[];
}

export type VisionTeam = {
  [key: string]: VisionPlayer[];
};

export interface VisionPlayer {
  playerId?: number;
  teamKey?: string;
  name: keyof typeof PLAYER_MAPPINGS;
  stats: PlayerStat[];
}

export interface Stat {
  statId: string;
  stat: string;
  statValue: string; // TODO: This should be allowed to be undefined but throw an error maybe?
}

export type AnalysisResults =
  | { status: VisionResultCodes.Success; data: VisionResult; message: string }
  | {
      status: VisionResultCodes.CheckRequest;
      data: VisionResult;
      message: string;
    }
  | { status: VisionResultCodes.Failed; message: string };
