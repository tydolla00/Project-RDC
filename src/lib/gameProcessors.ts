import {
  AnalyzedPlayer,
  AnalyzedTeamData,
  VisionPlayer,
  VisionResults,
  VisionTeam,
} from "@/app/actions/visionAction";
import {
  DocumentFieldOutput,
  BoundingRegionOutput,
} from "@azure-rest/ai-document-intelligence";
import { Player } from "@prisma/client";
import { RL_TEAM_MAPPING, VisionResultCodes } from "./constants";
import {
  findPlayerByGamerTag,
  PlayerNotFoundError,
} from "@/app/(routes)/admin/_utils/form-helpers";

export type GameProcessor = {
  processPlayers: (
    playerData: DocumentFieldOutput, // TODO: Type this better
    sessionPlayers: Player[],
  ) => { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean };
  calculateWinners: (visionResults: VisionResults) => VisionPlayer[];
  validateStats: (statValue: string | undefined) => {
    statValue: string;
    reqCheck: boolean;
  };
  finalCheck: () => { status: VisionResultCodes; data: any; message: string };
};

const processTeam = (
  teamData: AnalyzedTeamData,
  sessionPlayers: Player[],
): { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean } => {
  console.log("Processing Team: ", teamData);
  let reqCheckFlag = false;

  // Process Players
  try {
    const processedTeam = teamData.players?.forEach((player) => {
      const { reqCheckFlag: playerFlag, playerData } = processPlayer(player);

      const validatedPlayerData = validateAnalyzedPlayer(
        playerData,
        sessionPlayers,
      );
      console.log("Validated Player: ", validatedPlayerData);

      reqCheckFlag = reqCheckFlag || playerFlag;
      if (!validatedPlayerData) {
        console.error("Player validation failed: ", playerData);
        return {} as VisionPlayer;
      }
      return validatedPlayerData;
    });
    return { processedTeam, reqCheckFlag };
  } catch (error) {
    console.error("Error processing team: ", error);
  }

  // try {
  //   const processedPlayers =
  //     teamData.valueArray?.map((player: any) => {
  //       const { reqCheckFlag: playerFlag, playerData } = processPlayer(player);

  //       const validatedPlayerData = validateVisionResultPlayer(
  //         playerData,
  //         sessionPlayers,
  //       );
  //       console.log("Validated Player: ", validatedPlayerData);

  //       reqCheckFlag = reqCheckFlag || playerFlag;
  //       if (!validatedPlayerData) {
  //         console.error("Player validation failed: ", playerData);
  //         return {} as VisionPlayer;
  //       }
  //       return validatedPlayerData;
  //     }) || [];
  //   return { processedPlayers, reqCheckFlag };
  // } catch (error) {
  //   console.error("Error processing team: ", error);
  // }

  return { processedPlayers: [], reqCheckFlag: true };
};

// Changed from validateVisionResultPlayer
const validateAnalyzedPlayer = (
  processedPlayer: ProcessedPlayer,
  sessionPlayers: Player[],
) => {
  try {
    const foundPlayer: Player = findPlayerByGamerTag(
      processedPlayer.playerData.name,
    );
    const foundSessionPlayer = sessionPlayers.find(
      (p) => p.playerName === foundPlayer?.playerName,
    );
    if (!foundPlayer || !foundSessionPlayer) {
      console.error(`Player not found: ${processedPlayer.playerData.name}`);
      return false;
    } else {
      return {
        playerId: foundSessionPlayer?.playerId,
        name: foundSessionPlayer?.playerName,
        stats: [...processedPlayer.playerData.stats],
      };
    }
  } catch (error) {
    if (error instanceof PlayerNotFoundError) {
      console.error("Vision validation failed:", error.message);
      return false;
    }
    console.error("Unexpected error:", error);
    return false;
  }
};

type ProcessedStat = {
  statId: string;
  stat: string;
  statValue: number;
};

type ProcessedPlayer = {
  reqCheckFlag: boolean;
  playerData: {
    name: string;
    stats: ProcessedStat[];
  };
};

// Processes Player should end up as VisionPlayer 
const processPlayer = (player: AnalyzedPlayer): ProcessedPlayer => {
  console.log("Processing Player: ", player);
  const statValidations = {
    score: validateVisionStatValue(
      player.valueArray.valueObject?.Score?.content,
    ),
    goals: validateVisionStatValue(
      player.valueArray.valueObject?.Goals?.content,
    ),
    assists: validateVisionStatValue(
      player.valueArray.valueObject?.Assists?.content,
    ),
    saves: validateVisionStatValue(
      player.valueArray.valueObject?.Saves?.content,
    ),
    shots: validateVisionStatValue(
      player.valueArray.valueObject?.Shots?.content,
    ),
  };

  const reqCheckFlag = Object.values(statValidations).some((v) => v.reqCheck);

  return {
    reqCheckFlag,
    playerData: {
      name: player.valueArray.valueObject?.PlayerName?.content || "Unknown",
      stats: [
        {
          statId: "3",
          stat: "RL_SCORE",
          statValue: parseInt(statValidations.score.statValue, 10),
        },
        {
          statId: "4",
          stat: "RL_GOALS",
          statValue: parseInt(statValidations.goals.statValue, 10),
        },
        {
          statId: "5",
          stat: "RL_ASSISTS",
          statValue: parseInt(statValidations.assists.statValue, 10),
        },
        {
          statId: "6",
          stat: "RL_SAVES",
          statValue: parseInt(statValidations.saves.statValue, 10),
        },
        {
          statId: "7",
          stat: "RL_SHOTS",
          statValue: parseInt(statValidations.shots.statValue, 10),
        },
      ],
    },
  };
};

const validateVisionStatValue = (
  statValue: string | undefined,
): { statValue: string; reqCheck: boolean } => {
  // 0 is sometimes detected as Z | Ø
  if (statValue === "Z" || statValue === "Ø") {
    return { statValue: "0", reqCheck: true };
  } else if (statValue == undefined) {
    return { statValue: "0", reqCheck: true };
  } else {
    return { statValue: statValue, reqCheck: false };
  }
};

export const calculateRLWinners = (rlPlayers: VisionTeam[], analyzedTeamsData: AnalyzedTeamData[]) => {
  try {
    let blueTeamGoals = 0;
    let orangeTeamGoals = 0;

    // TODO: New Implementation parse through players rather than indiviual team

    // Players should have 2 arrays consisting of blue and orange team players
    if (rlPlayers.length !== 2) {
      return []; // Error in vision results
    }

    analyzedTeamsData.forEach((team: AnalyzedTeamData) => {
      team.players.forEach((player) => {
        player.stats.forEach((stat) => {
          if (stat.stat === "RL_GOALS") {
            if (team.teamName === "BluePlayers") {
              blueTeamGoals += parseInt(stat.statValue, 10);
            } else if (team.teamName === "OrangePlayers") {
              orangeTeamGoals += parseInt(stat.statValue, 10);
            }
          }
        });
      });
    }

    

    // visionResults.blueTeam.forEach((player) => {
    //   player.stats.forEach((stat) => {
    //     if (stat.stat === "RL_GOALS") {
    //       blueTeamGoals += parseInt(stat.statValue, 10);
    //     }
    //   });
    // });

    // visionResults.orangeTeam.forEach((player) => {
    //   player.stats.forEach((stat) => {
    //     if (stat.stat === "RL_GOALS") {
    //       orangeTeamGoals += parseInt(stat.statValue, 10);
    //     }
    //   });
    // });

    if (blueTeamGoals > orangeTeamGoals) {
      return visionResults.blueTeam;
    } else if (orangeTeamGoals > blueTeamGoals) {
      return visionResults.orangeTeam;
    } else {
      return []; // Error in vision results
    }
  } catch (error) {
    console.error("Error calculating RL winners: ", error);
    return [];
  }
};

export const RocketLeagueProcessor: GameProcessor = {
  processPlayers: function (
    playerData: DocumentFieldOutput,
    sessionPlayers: Player[],
  ) {
    // Process Players
    const visionResult: VisionResults = {
      blueTeam: [],
      orangeTeam: [],
    };
    let requiresCheck = false;

    Object.entries(playerData).forEach(([teamKey, teamData]) => {
      const teamColor =
        RL_TEAM_MAPPING[teamKey as keyof typeof RL_TEAM_MAPPING];

      if (teamColor) {
        const { processedPlayers, reqCheckFlag } = processTeam(
          teamData,
          sessionPlayers,
        );
        visionResult[teamColor] = processedPlayers;
        requiresCheck = requiresCheck || reqCheckFlag;
      }
    });

    // Calculate winners after processing all players
    const visionWinner = this.calculateWinners(visionResult);
    visionResult.winner = visionWinner;

    return {
      processedPlayers: [...visionResult.blueTeam, ...visionResult.orangeTeam],
      reqCheckFlag: requiresCheck,
    };
  },

  calculateWinners: calculateRLWinners,

  validateStats: validateVisionStatValue,

  finalCheck: () => {
    return requiresCheck
      ? {
          status: VisionResultCodes.CheckRequest,
          data: visionResult,
          message:
            "There was some trouble processing some stats. They have been assigned the most probable value but please check to ensure all stats are correct before submitting.",
        }
      : {
          status: VisionResultCodes.Success,
          data: visionResult,
          message: "Results have been successfully imported.",
        };
  },
};
