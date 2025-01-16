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

/**
 *  Analyze the screenshot of the game stats and extract the player stats
 * @param base64Source base64 encoded image source : string
 * @returns Object containing teams and player objects with their stats
 */
export const analyzeScreenShotTest = async (
  base64Source: string,
): Promise<VisionResult> => {
  // TODO: Add Loading State
  // TODO: Fix env config
  console.log(
    "Document Endpointz: ",
    process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"],
  );

  try {
    if (!process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_ENDPOINT"]) {
      throw new Error("Missing DOCUMENT_INTELLIGENCE_ENDPOINT in .env");
    } else if (!process.env["NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY"]) {
      throw new Error(
        "Missing NEXT_PUBLIC_DOCUMENT_INTELLIGENCE_API_KEY in .env",
      );
    }

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
    ("0");
    if (!result.analyzeResult || !result.analyzeResult.documents) {
      return {
        status: "Failed",
        message: "Analyze result or documents are undefined",
      };
    }
    const teams = result.analyzeResult.documents[0].fields;

    // Should check to ensure that there are two teams
    console.log("Teams: ", teams);

    // Should check that number of players is equal for both teams
    if (!teams) {
      throw new Error("Teams data is undefined");
    }

    const visionResult: VisionResults = {} as VisionResults;
    let reqUserCheck = false;
    // team: {type 'array', valueArray: players: { name, stats...} , confidence: number}
    Object.entries(teams).forEach(([team, players]) => {
      console.log("Team Name: ", team);
      console.log("Players: ", players);

      // valueInteger === confirmed number and is proper integer -- content holds the actual value detected by the model and is always present
      if (team == "BluePlayers" && players.valueArray) {
        visionResult.blueTeam = players.valueArray.map((player) => {
          return {
            name: player.valueObject?.PlayerName?.content || "Unknown",
            stats: [
              {
                statId: "3",
                stat: "RL_SCORE",
                statValue:
                  validateVisionStatValue(player.valueObject?.Score?.content) ||
                  "0",
              },
              {
                statId: "4",
                stat: "RL_GOALS",
                statValue:
                  validateVisionStatValue(player.valueObject?.Goals?.content) ||
                  "0",
              },
              {
                statId: "5",
                stat: "RL_ASSISTS",
                statValue:
                  validateVisionStatValue(
                    player.valueObject?.Assists?.content,
                  ) || "0",
              },
              {
                statId: "6",
                stat: "RL_SAVES",
                statValue:
                  validateVisionStatValue(player.valueObject?.Saves?.content) ||
                  "0",
              },
              {
                statId: "7",
                stat: "RL_SHOTS",
                statValue:
                  validateVisionStatValue(player.valueObject?.Shots?.content) ||
                  "0",
              },
            ],
          };
        });
      }
      if (team == "OrangePlayers" && players.valueArray) {
        visionResult.orangeTeam = players.valueArray.map((player) => {
          return {
            name: player.valueObject?.PlayerName?.content || "Unknown",
            stats: [
              {
                statId: "3",
                stat: "RL_SCORE",
                statValue:
                  validateVisionStatValue(player.valueObject?.Score?.content) ||
                  "0",
              },
              {
                statId: "4",
                stat: "RL_GOALS",
                statValue:
                  validateVisionStatValue(player.valueObject?.Goals?.content) ||
                  "0",
              },
              {
                statId: "5",
                stat: "RL_ASSISTS",
                statValue:
                  validateVisionStatValue(
                    player.valueObject?.Assists?.content,
                  ) || "0",
              },
              {
                statId: "6",
                stat: "RL_SAVES",
                statValue:
                  validateVisionStatValue(player.valueObject?.Saves?.content) ||
                  "0",
              },
              {
                statId: "7",
                stat: "RL_SHOTS",
                statValue:
                  validateVisionStatValue(player.valueObject?.Shots?.content) ||
                  "0",
              },
            ],
          };
        });
      }
    });
    // TODO: Pass this to visionResult
    const visionWinner = calculateRLWinners(visionResult);
    visionResult.winner = visionWinner;
    return {
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

const validateVisionStatValue = (statValue: string | undefined) => {
  // 0 is sometimes detected as Z | Ø on occassion so we need to handle this
  if (statValue === "Z" || statValue === "Ø") {
    return "0";
  } else {
    return statValue;
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
    return undefined; // Error in vision results
  }
};
