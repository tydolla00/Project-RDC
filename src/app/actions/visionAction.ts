import { VisionResultCodes } from "@/lib/constants";
import DocumentIntelligence, {
  getLongRunningPoller,
  AnalyzeResultOperationOutput,
  isUnexpected,
  DocumentFieldOutput,
} from "@azure-rest/ai-document-intelligence";
import { Player } from "@prisma/client";
import {
  findPlayerByGamerTag,
  PlayerNotFoundError,
} from "../(routes)/admin/_utils/form-helpers";

const client = DocumentIntelligence(
  process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"]!,
  {
    key: process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY"]!,
  },
);
const modelId = "RDC-Custom-Model";

export interface VisionResults {
  winner?: Array<VisionPlayer>;
  blueTeam: Array<VisionPlayer>;
  orangeTeam: Array<VisionPlayer>;
}

export interface VisionPlayer {
  playerId?: number;
  name: string;
  stats: VisionStat[];
}

export interface VisionStat {
  statId: string;
  stat: string;
  statValue: string; // TODO: This should be allowed to be undefined but throw an error maybe?
}

export type VisionResult =
  | { status: VisionResultCodes.Success; data: VisionResults; message: string }
  | {
      status: VisionResultCodes.CheckRequest;
      data: VisionResults;
      message: string;
    }
  | { status: VisionResultCodes.Failed; message: string };

const TEAM_MAPPING = {
  BluePlayers: "blueTeam",
  OrangePlayers: "orangeTeam",
} as const;

/**
 * Processes raw player data from vision recognition into a structured format
 *
 * @description
 * This function:
 * 1. Validates and normalizes all player stats (score, goals, assists, saves, shots)
 * 2. Aggregates validation flags to indicate potential recognition issues
 * 3. Maps raw data into a standardized player data structure
 * 4. Handles missing or invalid values with appropriate defaults
 *
 * @param player - Raw player data from vision recognition
 * @returns Object containing processed player data and validation flag
 */
const processPlayer = (player: any) => {
  console.log("Processing Player: ", player);
  const statValidations = {
    score: validateVisionStatValue(player.valueObject?.Score?.content),
    goals: validateVisionStatValue(player.valueObject?.Goals?.content),
    assists: validateVisionStatValue(player.valueObject?.Assists?.content),
    saves: validateVisionStatValue(player.valueObject?.Saves?.content),
    shots: validateVisionStatValue(player.valueObject?.Shots?.content),
  };

  const reqCheckFlag = Object.values(statValidations).some((v) => v.reqCheck);

  return {
    reqCheckFlag,
    playerData: {
      name: player.valueObject?.PlayerName?.content || "Unknown",
      stats: [
        {
          statId: "3",
          stat: "RL_SCORE",
          statValue: statValidations.score.statValue,
        },
        {
          statId: "4",
          stat: "RL_GOALS",
          statValue: statValidations.goals.statValue,
        },
        {
          statId: "5",
          stat: "RL_ASSISTS",
          statValue: statValidations.assists.statValue,
        },
        {
          statId: "6",
          stat: "RL_SAVES",
          statValue: statValidations.saves.statValue,
        },
        {
          statId: "7",
          stat: "RL_SHOTS",
          statValue: statValidations.shots.statValue,
        },
      ],
    },
  };
};

/**
 * Processes vision recognition data for a team of players
 *
 * @description
 * This function:
 * 1. Maps over each player in the team data
 * 2. Processes individual player stats and validates results
 * 3. Validates player identities against session players
 * 4. Aggregates validation flags to indicate if manual review is needed
 *
 * @param teamData - The raw team data from vision recognition
 * @param sessionPlayers - Array of valid players in the current session for validation
 * @returns Object containing processed player data and validation flags
 * @throws Logs errors if player processing fails
 */
const processTeam = (
  teamData: DocumentFieldOutput,
  sessionPlayers: Player[],
): { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean } => {
  console.log("Processing Team: ", teamData);
  let reqCheckFlag = false;

  try {
    const processedPlayers =
      teamData.valueArray?.map((player: any) => {
        const { reqCheckFlag: playerFlag, playerData } = processPlayer(player);

        const validatedPlayerData = validateVisionResultPlayer(
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
      }) || [];
    return { processedPlayers, reqCheckFlag };
  } catch (error) {
    console.error("Error processing team: ", error);
  }

  return { processedPlayers: [], reqCheckFlag: true };
};

/**
 * Analyzes a screenshot using Azure Document Intelligence to extract game stats
 *
 * @description
 * This function:
 * 1. Sends the image to Azure's Document Intelligence API for analysis
 * 2. Processes the response to extract team and player information
 * 3. Validates and normalizes all extracted data
 * 4. Determines match winners based on team scores
 * 5. Flags any potential recognition issues that need manual review
 *
 * @param base64Source - Base64 encoded image data to analyze
 * @param sessionPlayers - Array of valid players in the current session for validation
 * @returns A VisionResult object containing processed data and status information
 * @throws Returns a Failed status with error details if processing fails
 */
export const analyzeScreenShot = async (
  base64Source: string,
  sessionPlayers: Player[] = [],
): Promise<VisionResult> => {
  try {
    const response = await client
      .path("/documentModels/{modelId}:analyze", modelId)
      .post({
        contentType: "application/json",
        body: {
          base64Source: base64Source,
        },
        queryParameters: {
          locale: "en-US",
        },
      });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const poller = await getLongRunningPoller(client, response);
    const result = (await poller.pollUntilDone())
      .body as AnalyzeResultOperationOutput;

    if (!result.analyzeResult || !result.analyzeResult.documents) {
      return {
        status: VisionResultCodes.Failed,
        message: "Analyze result or documents are undefined",
      };
    }
    const teams = result.analyzeResult.documents[0].fields;

    // TODO: should check to ensure that there are at least two teams
    // Should check that number of players is equal for both teams
    if (!teams) {
      throw new Error("Teams data is undefined");
    }

    const visionResult: VisionResults = {} as VisionResults;

    let requiresCheck = false;

    Object.entries(teams).forEach(([teamKey, teamData]) => {
      const teamColor = TEAM_MAPPING[teamKey as keyof typeof TEAM_MAPPING];
      if (teamColor) {
        const { processedPlayers, reqCheckFlag } = processTeam(
          teamData,
          sessionPlayers,
        );
        visionResult[teamColor] = processedPlayers;
        requiresCheck = requiresCheck || reqCheckFlag;
      }
    });

    console.log("Vision Result: ", visionResult);

    // Check to make sure players are valid
    // validateVisionResultPlayers(
    //   [...visionResult.blueTeam, ...visionResult.orangeTeam],
    //   sessionPlayers,
    // );
    const visionWinner = calculateRLWinners(visionResult);
    visionResult.winner = visionWinner;
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
  } catch (error) {
    console.error(error);
    return {
      status: VisionResultCodes.Failed,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Validates and normalizes stat values from vision processing results
 *
 * @description
 * Handles special cases in vision recognition:
 * - Converts 'Z' or 'Ø' to '0' as they are commonly misrecognized
 * - Handles undefined values by converting to '0'
 * - Flags values that need manual verification
 *
 * @param statValue - The raw stat value from vision recognition
 * @returns Object containing normalized stat value and flag indicating if manual verification is needed
 */
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

/**
 * Calculates the winning team in a Rocket League match based on total goals
 *
 * @description
 * This function:
 * 1. Sums up goals for each team from player stats
 * 2. Compares total goals between blue and orange teams
 * 3. Returns the array of players from the winning team
 *
 * @param visionResults - Object containing both teams' player data and stats
 * @returns Array of VisionPlayer objects from the winning team, or empty array if no winner can be determined
 */
export const calculateRLWinners = (visionResults: VisionResults) => {
  let blueTeamGoals = 0;
  let orangeTeamGoals = 0;

  visionResults.blueTeam.forEach((player) => {
    player.stats.forEach((stat) => {
      if (stat.stat === "RL_GOALS") {
        blueTeamGoals += parseInt(stat.statValue, 10);
      }
    });
  });

  visionResults.orangeTeam.forEach((player) => {
    player.stats.forEach((stat) => {
      if (stat.stat === "RL_GOALS") {
        orangeTeamGoals += parseInt(stat.statValue, 10);
      }
    });
  });

  if (blueTeamGoals > orangeTeamGoals) {
    return visionResults.blueTeam;
  } else if (orangeTeamGoals > blueTeamGoals) {
    return visionResults.orangeTeam;
  } else {
    return []; // Error in vision results
  }
};

/**
 * Validates an entire team's worth of players from vision results
 *
 * @description
 * This function:
 * 1. Iterates through all players from vision recognition
 * 2. Validates each player's identity using gamer tags
 * 3. Verifies all players are part of the current session
 * 4. Early returns false if any player fails validation
 *
 * @param visionPlayers - Array of players from vision recognition
 * @param sessionPlayers - Array of valid players in the current session
 * @returns boolean indicating if all players were successfully validated
 * @throws Logs validation failures to console
 */
const validateVisionResultPlayers = (
  visionPlayers: VisionPlayer[],
  sessionPlayers: Player[],
) => {
  // TODO: Should not automatically insert players if this fails but should maybe store the data and allow the user to fix or something before inputing
  console.log("Validating Vision Players: ", visionPlayers);

  try {
    for (const player of visionPlayers) {
      const processedPlayer: Player = findPlayerByGamerTag(player.name);
      console.log("Processed Player: ", processedPlayer);
      const foundPlayer = sessionPlayers.find(
        (p) => p.playerName === processedPlayer?.playerName,
      );
      console.log("Found Player: ", foundPlayer);
      if (!foundPlayer) {
        console.error(`Player not found: ${player.name}`);
      } else {
        continue;
      }
    }
    return true;
  } catch (error) {
    if (error instanceof PlayerNotFoundError) {
      console.error("Vision validation failed:", error.message);
      return false;
    }
    console.error("Unexpected error:", error);
    return false;
  }
};

/**
 * Validates a player from vision results against session players and normalizes their data
 *
 * @description
 * This function:
 * 1. Takes a player from vision recognition and attempts to find their real identity
 * 2. Verifies the player is part of the current session
 * 3. Normalizes the player data with correct ID and name if valid
 * 4. Preserves the original stats while updating player identity
 *
 * @param visionPlayer - The player data from vision recognition
 * @param sessionPlayers - Array of valid players in the current session
 * @returns Normalized VisionPlayer object if valid, false if validation fails
 * @throws Logs validation errors to console
 */
const validateVisionResultPlayer = (
  visionPlayer: VisionPlayer,
  sessionPlayers: Player[],
): VisionPlayer | false => {
  try {
    const processedPlayer: Player = findPlayerByGamerTag(visionPlayer.name);
    const foundPlayer = sessionPlayers.find(
      (p) => p.playerName === processedPlayer?.playerName,
    );
    if (!foundPlayer) {
      console.error(`Player not found: ${visionPlayer.name}`);
      return false;
    } else {
      return {
        playerId: foundPlayer.playerId,
        name: foundPlayer.playerName,
        stats: [...visionPlayer.stats],
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
