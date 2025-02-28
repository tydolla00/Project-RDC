import {
  AnalyzedPlayer,
  AnalyzedTeamData,
  Stat,
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
    const processedPlayers =
      teamData.players?.map((player) => {
        const processedPlayer = processPlayer(player);

        const validatedPlayerData = validateProcessedlayer(
          processedPlayer,
          sessionPlayers,
        );
        console.log("Validated Player: ", validatedPlayerData);

        reqCheckFlag = reqCheckFlag || processedPlayer.reqCheckFlag;
        if (!validatedPlayerData) {
          console.error("Player validation failed: ", processPlayer);
          return {} as VisionPlayer;
        }
        return validatedPlayerData;
      }) || [];
    return { processedPlayers, reqCheckFlag };
  } catch (error) {
    console.error("Error processing team: ", error);
    return { processedPlayers: [], reqCheckFlag: true }; // Changed from processedTeam
  }
};

// Changed from validateVisionResultPlayer
// validated processedPlayer to VisionPlayer
const validateProcessedlayer = (
  processedPlayer: ProcessedPlayer,
  sessionPlayers: Player[],
): VisionPlayer | undefined => {
  try {
    const foundPlayer: Player = findPlayerByGamerTag(
      processedPlayer.playerData.name,
    );
    const foundSessionPlayer = sessionPlayers.find(
      (p) => p.playerName === foundPlayer?.playerName,
    );
    if (!foundPlayer || !foundSessionPlayer) {
      console.error(`Player not found: ${processedPlayer.playerData.name}`);
      throw new PlayerNotFoundError(
        `Player not found: ${processedPlayer.playerData.name}`,
      );
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
    }
    console.error("Unexpected error:", error);
    return undefined;
  }
};

type ProcessedPlayer = {
  reqCheckFlag: boolean;
  playerData: {
    name: string;
    stats: Stat[];
  };
};

// Processes Player should end up as VisionPlayer
const processPlayer = (player: AnalyzedPlayer): ProcessedPlayer => {
  console.log("Processing Player: ", player);

  const statValidations = Object.entries(player.valueArray.valueObject).reduce(
    (acc, [fieldName, field]) => {
      // Skip PlayerName field
      if (fieldName !== "PlayerName") {
        // Add validation for each stat
        acc[fieldName.toLowerCase()] = validateVisionStatValue(field.content);
      }
      return acc;
    },
    {} as Record<string, { statValue: string; reqCheck: boolean }>,
  );

  const reqCheckFlag = Object.values(statValidations).some((v) => v.reqCheck);
  // Map to RL stat IDs - This could be moved to a config
  const statMapping: Record<string, { id: string; name: string }> = {
    score: { id: "3", name: "RL_SCORE" },
    goals: { id: "4", name: "RL_GOALS" },
    assists: { id: "5", name: "RL_ASSISTS" },
    saves: { id: "6", name: "RL_SAVES" },
    shots: { id: "7", name: "RL_SHOTS" },
  };

  return {
    reqCheckFlag,
    playerData: {
      name: player.valueArray.valueObject?.PlayerName?.content || "Unknown",
      stats: Object.entries(statValidations).map(([statKey, validation]) => ({
        statId: statMapping[statKey]?.id || "0",
        stat: statMapping[statKey]?.name || `RL_${statKey.toUpperCase()}`,
        statValue: parseInt(validation.statValue, 10),
      })),
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

export const calculateRLWinners = (
  rlPlayers: VisionTeam[],
  analyzedTeamsData: AnalyzedTeamData[],
) => {
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
        const analyzedPlayerValueObject = player.valueArray.valueObject;

        const playerGoals = Object.entries(analyzedPlayerValueObject).reduce(
          (acc, [fieldName, field]) => {
            if (fieldName === "RL_GOALS") {
              acc += parseInt(field.content, 10);
            }
            return acc;
          },
          0,
        );

        if (team.teamName === "BluePlayers") {
          blueTeamGoals += playerGoals;
        } else if (team.teamName === "OrangePlayers") {
          orangeTeamGoals += playerGoals;
        }
      });
    });
    if (blueTeamGoals > orangeTeamGoals) {
      return "Blue";
    } else if (orangeTeamGoals > blueTeamGoals) {
      return "Orange"; // TODO - Return proper
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
    // const visionResult: VisionResults = {
    //   blueTeam: [],
    //   orangeTeam: [],
    // };
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

    // // Calculate winners after processing all players
    // const visionWinner = this.calculateWinners(visionResult);
    // visionResult.winner = visionWinner;

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
