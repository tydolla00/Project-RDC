import { GAME_MODEL_MAPPING, VisionResultCodes } from "@/lib/constants";
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
import { RL_TEAM_MAPPING } from "@/lib/constants";

const client = DocumentIntelligence(
  process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"]!,
  {
    key: process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY"]!,
  },
);

// const modelId = "RDC-Custom-Model";

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

type GameProcessor = {
  processTeam: (
    teamData: DocumentFieldOutput,
    sessionPlayers: Player[],
  ) => { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean };
  calculateWinners: (visionResults: VisionResults) => VisionPlayer[];
  validateStats: (statValue: string | undefined) => {
    statValue: string;
    reqCheck: boolean;
  };
};

export const RocketLeagueProcessor: GameProcessor = {
  processTeam: function (
    teamData: DocumentFieldOutput,
    sessionPlayers: Player[],
  ): { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean } {
    throw new Error("Function not implemented.");
  },
  calculateWinners: function (visionResults: VisionResults): VisionPlayer[] {
    throw new Error("Function not implemented.");
  },
  validateStats: function (statValue: string | undefined): {
    statValue: string;
    reqCheck: boolean;
  } {
    throw new Error("Function not implemented.");
  },
};

export const getGameProcessor = (gameId: number): GameProcessor => {
  switch (gameId) {
    case 3:
      return RocketLeagueProcessor;
    default:
      throw new Error(`Invalid game id: ${gameId}`);
  }
};

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
 *  Analyze the screenshot of the game stats and extract the player stats
 * @param base64Source base64 encoded image source : string
 * @returns Object containing teams and player objects with their stats
 */
export const analyzeScreenShot = async (
  base64Source: string,
  sessionPlayers: Player[] = [],
  gameId: number,
): Promise<VisionResult> => {
  try {
    const gameProcessor = getGameProcessor(gameId);
    const modelId = GAME_MODEL_MAPPING[gameId];

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

    // Go into individual game checks

    Object.entries(teams).forEach(([teamKey, teamData]) => {
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

// TODO: RDC Vision grabs the winner text value (most of the time) can see if we can use that to determine winner potentially
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
