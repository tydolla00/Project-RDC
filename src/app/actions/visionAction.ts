import DocumentIntelligence, {
  getLongRunningPoller,
  AnalyzeResultOperationOutput,
  isUnexpected,
} from "@azure-rest/ai-document-intelligence";

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
  name: string;
  stats: VisionStat[];
}

export interface VisionStat {
  statId: string;
  stat: string;
  statValue: string; // TODO: This should be allowed to be undefined but throw an error maybe?
}

export type VisionResult =
  | { status: "Success"; data: VisionResults }
  | { status: "CheckReq"; data: VisionResults; message: string }
  | { status: "Failed"; message: string };

const TEAM_MAPPING = {
  BluePlayers: "blueTeam",
  OrangePlayers: "orangeTeam",
} as const;

const processPlayer = (player: any) => {
  console.log("Processing Player: ", player);
  const validations = {
    score: validateVisionStatValue(player.valueObject?.Score?.content),
    goals: validateVisionStatValue(player.valueObject?.Goals?.content),
    assists: validateVisionStatValue(player.valueObject?.Assists?.content),
    saves: validateVisionStatValue(player.valueObject?.Saves?.content),
    shots: validateVisionStatValue(player.valueObject?.Shots?.content),
  };

  const reqCheckFlag = Object.values(validations).some((v) => v.reqCheck);

  return {
    reqCheckFlag,
    playerData: {
      name: player.valueObject?.PlayerName?.content || "Unknown",
      stats: [
        {
          statId: "3",
          stat: "RL_SCORE",
          statValue: validations.score.statValue,
        },
        {
          statId: "4",
          stat: "RL_GOALS",
          statValue: validations.goals.statValue,
        },
        {
          statId: "5",
          stat: "RL_ASSISTS",
          statValue: validations.assists.statValue,
        },
        {
          statId: "6",
          stat: "RL_SAVES",
          statValue: validations.saves.statValue,
        },
        {
          statId: "7",
          stat: "RL_SHOTS",
          statValue: validations.shots.statValue,
        },
      ],
    },
  };
};

const processTeam = (teamData: any) => {
  console.log("Processing Team: ", teamData);
  let reqCheckFlag = false;
  const players =
    teamData.valueArray.map((player: any) => {
      const { reqCheckFlag: playerFlag, playerData } = processPlayer(player);
      reqCheckFlag = reqCheckFlag || playerFlag;
      return playerData;
    }) || [];

  return { players, reqCheckFlag };
};

/**
 *  Analyze the screenshot of the game stats and extract the player stats
 * @param base64Source base64 encoded image source : string
 * @returns Object containing teams and player objects with their stats
 */
export const analyzeScreenShot = async (
  base64Source: string,
): Promise<VisionResult> => {
  // TODO: Fix env config
  let reqCheckFlag = false;

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
        status: "Failed",
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
        const { players, reqCheckFlag } = processTeam(teamData);
        visionResult[teamColor] = players;
        requiresCheck = requiresCheck || reqCheckFlag;
      }
    });
    const visionWinner = calculateRLWinners(visionResult);
    visionResult.winner = visionWinner;
    console.log("Vision Result: ", visionResult);
    return requiresCheck
      ? {
          status: "CheckReq",
          data: visionResult,
          message:
            "There was some trouble processing some stats. They have been assigned the most probable value but please check to ensure all stats are correct before submitting.",
        }
      : {
          status: "Success",
          data: visionResult,
        };
  } catch (error) {
    console.error(error);
    return {
      status: "Failed",
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

// TODO: RDC Vision grabs the winner (most of the time) can see if we can use that to determine winner potentially
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

const validateVisionResultPlayers = (players: []) => {
  console.log("Validating Vision Results!");
  // TODO: Check if the players from res is the same as the players in the current session
  // TODO: Should we allow players to be added to the session if they are not in the current session?
};
