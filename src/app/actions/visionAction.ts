import { GAME_CONFIGS, VisionResultCodes } from "@/lib/constants";
import DocumentIntelligence, {
  getLongRunningPoller,
  AnalyzeResultOperationOutput,
  isUnexpected,
} from "@azure-rest/ai-document-intelligence";
import { Player } from "@prisma/client";
import { GameProcessor, RocketLeagueProcessor } from "@/lib/gameProcessors";

const client = DocumentIntelligence(
  process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"]!,
  {
    key: process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY"]!,
  },
);

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
  name: string;
  stats: Stat[];
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

export const getGameProcessor = (gameId: number): GameProcessor => {
  switch (gameId) {
    case 3:
      return RocketLeagueProcessor;
    default:
      throw new Error(`Invalid game id: ${gameId}`);
  }
};

/**
 *  Analyze the screenshot of the game stats and extract the player stats
 * @param base64Source base64 encoded image source : string
 * @returns Object containing teams and player objects with their stats
 */
export const analyzeScreenShot = async (
  base64Source: string,
  sessionPlayers: Player[] = [],
  gameId: number,
): Promise<AnalysisResults> => {
  try {
    const gameProcessor = getGameProcessor(gameId);
    const gameConfig = GAME_CONFIGS[gameId];

    const response = await client
      .path("/documentModels/{modelId}:analyze", gameConfig.modelId)
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

    // Analyzed Result should differ depdending on model
    // Team based models should return players grouped by team
    // Individual player models should return all players in one array

    // Each player object from appropriate vision model should have all stats associated with players
    // , may or may not be broken up into teams depending on model
    // RL: Blue Team, Orange Team
    // MK: Yoshi, Mario, Luigi, Peach, etc...
    const analyzedPlayers = result.analyzeResult.documents[0].fields;
    // Returns team objects eg RL returns two arrays of playersStat field Arrays (not typed)
    console.log("Analyzed Teams: ", analyzedPlayers);

    if (!analyzedPlayers) {
      throw new Error("Vision Analysis Player Results are undefined");
    }
    // Go into individual game checks
    const teamsArray: AnalyzedTeamData[] = Object.entries(analyzedPlayers).map(
      ([teamName, teamData]) => ({
        teamName,
        players: teamData as unknown as AnalyzedPlayersObj,
      }),
    );

    const processedPlayers = gameProcessor.processPlayers(
      teamsArray,
      sessionPlayers,
    );
    console.log("Processed Players: ", processedPlayers);
    const winners = gameProcessor.calculateWinners(
      processedPlayers.processedPlayers,
    );

    const validatedResult: AnalysisResults = gameProcessor.validateResults(
      processedPlayers.processedPlayers,
      winners,
      processedPlayers.reqCheckFlag,
    );

    console.log("Teams Array: ", teamsArray);
    console.log("Validated Result: ", validatedResult);
    return validatedResult;
  } catch (error) {
    console.error(error);
    return {
      status: VisionResultCodes.Failed,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

type PlayerField = {
  type: string;
  content: string;
  valueString?: string;
  valueInteger?: number;
  confidence: number;
};

export type AnalyzedPlayer = {
  type: "object";
  valueObject: {
    [fieldName: string]: PlayerField;
  };
};

export type AnalyzedTeamData = {
  teamName: string;
  players: AnalyzedPlayersObj;
};

export type AnalyzedPlayersObj = {
  type: "array";
  valueArray: AnalyzedPlayer[];
};
