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

interface visionResults {
  winner?: string;
  blueTeam: Array<visionPlayer>;
  orangeTeam: Array<visionPlayer>;
}

interface visionPlayer {
  name: string;
  stats: rlVisionStats;
}

interface rlVisionStats {
  score: string | undefined;
  goals: string | undefined;
  assists: string | undefined;
  saves: string | undefined;
  shots: string | undefined;
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

    const visionResult: visionResults = {} as visionResults;
    // team: {type 'array', valueArray: players: { name, stats...} , confidence: number}
    Object.entries(teams).forEach(([team, players]) => {
      console.log("Team Name: ", team);
      console.log("Players: ", players);

      // valueInteger === confirmed number and is integer properly -- content holds the actual value detected by the model and is always present
      if (team == "BluePlayers" && players.valueArray) {
        visionResult.blueTeam = players.valueArray.map((player) => {
          return {
            name: player.valueObject?.PlayerName?.content || "Unknown",
            stats: {
              score: player.valueObject?.Score?.content || undefined,
              goals: player.valueObject?.Goals?.content || undefined,
              assists: player.valueObject?.Assists?.content || undefined,
              saves: player.valueObject?.Saves?.content || undefined,
              shots: player.valueObject?.Shots?.content || undefined,
            },
          };
        });
      }

      if (team == "OrangePlayers" && players.valueArray) {
        visionResult.orangeTeam = players.valueArray.map((player) => {
          return {
            name: player.valueObject?.PlayerName?.content || "Unknown",
            stats: {
              score: player.valueObject?.Score?.content || undefined,
              goals: player.valueObject?.Goals?.content || undefined,
              assists: player.valueObject?.Assists?.content || undefined,
              saves: player.valueObject?.Saves?.content || undefined,
              shots: player.valueObject?.Shots?.content || undefined,
            },
          };
        });
      }
    });

    console.log("Vision Result: ", visionResult);
  } catch (error) {
    console.error(error);
  }
};
