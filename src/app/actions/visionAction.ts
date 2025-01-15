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
  winner?: string;
  blueTeam: Array<VisionPlayer>;
  orangeTeam: Array<VisionPlayer>;
}

export interface VisionPlayer {
  name: string;
  stats: VisionStat[];
}

export interface RLVisionStats {
  score: string | undefined;
  goals: string | undefined;
  assists: string | undefined;
  saves: string | undefined;
  shots: string | undefined;
}

interface VisionStat {
  statName: string | undefined;
}

/**
 *  Analyze the screenshot of the game stats and extract the player stats
 * @param base64Source base64 encoded image source : string
 * @returns Object containing teams and player objects with their stats
 */
export const analyzeScreenShotTest = async (base64Source: string) => {
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
      throw new Error("Analyze result or documents are undefined");
    }
    const teams = result.analyzeResult.documents[0].fields;

    // Should check to ensure that there are two teams
    console.log("Teams: ", teams);

    // Should check that number of players is equal for both teams
    if (!teams) {
      throw new Error("Teams data is undefined");
    }

    const visionResult: VisionResults = {} as VisionResults;
    // team: {type 'array', valueArray: players: { name, stats...} , confidence: number}
    Object.entries(teams).forEach(([team, players]) => {
      console.log("Team Name: ", team);
      console.log("Players: ", players);

      // valueInteger === confirmed number and is integer properly -- content holds the actual value detected by the model and is always present
      if (team == "BluePlayers" && players.valueArray) {
        visionResult.blueTeam = players.valueArray.map((player) => {
          return {
            name: player.valueObject?.PlayerName?.content || "Unknown",
            stats: [
              {
                statName: "Score",
                statValue: player.valueObject?.Score?.content || undefined,
              },
              {
                statName: "Goals",
                statValue: player.valueObject?.Goals?.content || undefined,
              },
              {
                statName: "Assists",
                statValue: player.valueObject?.Assists?.content || undefined,
              },
              {
                statName: "Saves",
                statValue: player.valueObject?.Saves?.content || undefined,
              },
              {
                statName: "Shots",
                statValue: player.valueObject?.Shots?.content || undefined,
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
                statName: "Score",
                statValue: player.valueObject?.Score?.content || undefined,
              },
              {
                statName: "Goals",
                statValue: player.valueObject?.Goals?.content || undefined,
              },
              {
                statName: "Assists",
                statValue: player.valueObject?.Assists?.content || undefined,
              },
              {
                statName: "Saves",
                statValue: player.valueObject?.Saves?.content || undefined,
              },
              {
                statName: "Shots",
                statValue: player.valueObject?.Shots?.content || undefined,
              },
            ],
          };
        });
      }
    });

    console.log("Vision Result: ", visionResult);
    return visionResult;
  } catch (error) {
    console.error(error);
  }
};
