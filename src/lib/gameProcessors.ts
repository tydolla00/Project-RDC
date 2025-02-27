import { VisionPlayer, VisionResults } from "@/app/actions/visionAction";
import { DocumentFieldOutput } from "@azure-rest/ai-document-intelligence";
import { Player } from "@prisma/client";
import { RL_TEAM_MAPPING, VisionResultCodes } from "./constants";
import {
  findPlayerByGamerTag,
  PlayerNotFoundError,
} from "@/app/(routes)/admin/_utils/form-helpers";

export type AnalyzedTeams = { [key: string]: VisionPlayer[] };

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

const processRocketLeaguePlayers = (
  playerData: DocumentFieldOutput,
  sessionPlayers: Player[],
  visionResult: VisionResults,
) => {
  const processedPlayers: VisionPlayer[] = [];
  let requiresCheck = false;

  Object.entries(playerData).forEach(([teamKey, teamData]) => {
    const teamColor = RL_TEAM_MAPPING[teamKey as keyof typeof RL_TEAM_MAPPING];

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
};

export const calculateRLWinners = (rlPlayers: VisionPlayer[]) => {
  try {
    let blueTeamGoals = 0;
    let orangeTeamGoals = 0;

    // TODO: New Implementation parse through players rather than indiviual team

    // Players should have 2 arrays consisting of blue and orange team players
    if (rlPlayers.length !== 2) {
      return []; // Error in vision results
    }
    // Should each team have an optional "team name" field?
    // Or should we just assume the first team is blue and the second is orange?
    // Or should we just compare the goals of each team and determine the winner that way?

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
  } catch (error) {
    console.error("Error calculating RL winners: ", error);
    return [];
  }
};

// export const RocketLeagueProcessor: GameProcessor = {
//   processPlayers: function (
//     playerData: DocumentFieldOutput,
//     sessionPlayers: Player[],
//   ): { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean } {
//     // Winner Stuff
//     const visionResult: VisionResults = {} as VisionResults;
//     const requiresCheck = false;

//     const visionWinner = calculateRLWinners(visionResult);
//     visionResult.winner = visionWinner;
//      TODO: Below needs to be incorporated still into gameprocessors
// TODO: Add new function to processor that uses this
// return requiresCheck
//   ? {
//       status: VisionResultCodes.CheckRequest,
//       data: visionResult,
//       message:
//         "There was some trouble processing some stats. They have been assigned the most probable value but please check to ensure all stats are correct before submitting.",
//     }
//   : {
//       status: VisionResultCodes.Success,
//       data: visionResult,
//       message: "Results have been successfully imported.",
//     };
//   },
//   calculateWinners: function (visionResults: VisionResults): VisionPlayer[] {
//     throw new Error("Function not implemented.");
//   },
//   validateStats: function (statValue: string | undefined): {
//     statValue: string;
//     reqCheck: boolean;
//   } {
//     throw new Error("Function not implemented.");
//   },
// };

export const RocketLeagueProcessor: GameProcessor = {
  processPlayers: function (
    playerData: DocumentFieldOutput,
    sessionPlayers: Player[],
  ) {
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
};
