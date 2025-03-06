import {
  AnalyzedPlayer,
  AnalyzedTeamData,
  Stat,
  VisionPlayer,
  VisionResult,
  VisionTeam,
} from "@/app/actions/visionAction";
import { Player } from "@prisma/client";
import { RL_TEAM_MAPPING, VisionResultCodes } from "./constants";
import {
  findPlayerByGamerTag,
  PlayerNotFoundError,
} from "@/app/(routes)/admin/_utils/form-helpers";

type WinnerType = "TEAM" | "INDIVIDUAL";

interface WinnerConfig {
  type: WinnerType;
  winCondition: {
    statName: string;
    comparison: "highest" | "lowest" | "sum";
  };
}

export type GameProcessor = {
  processPlayers: (
    playerData: AnalyzedTeamData[], // TODO: Type this better
    sessionPlayers: Player[],
  ) => { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean };
  calculateWinners: (players: VisionPlayer[]) => VisionPlayer[];
  validateStats: (statValue: string | undefined) => {
    statValue: string;
    reqCheck: boolean;
  };
  validateResults: (
    visionPlayers: VisionPlayer[],
    winners: VisionPlayer[],
    requiresCheck: boolean,
  ) => {
    status: VisionResultCodes;
    data: any;
    message: string;
  };
};

const processTeam = (
  teamData: AnalyzedTeamData,
  sessionPlayers: Player[],
): { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean } => {
  console.log("Processing Team: ", teamData.players);
  let reqCheckFlag = false;

  // Process Players
  try {
    const processedPlayers =
      teamData.players.valueArray?.map((player) => {
        const processedPlayer = processPlayer(player);

        const validatedPlayerData = validateProcessedPlayer(
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
const validateProcessedPlayer = (
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
  teamKey?: string;
};

const processPlayer = (player: AnalyzedPlayer): ProcessedPlayer => {
  console.log("Processing Player: ", player);

  const statValidations = Object.entries(player.valueObject).reduce(
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
      name: player.valueObject?.PlayerName?.content || "Unknown",
      stats: Object.entries(statValidations).map(([statKey, validation]) => ({
        statId: statMapping[statKey]?.id || "0",
        stat: statMapping[statKey]?.name || `RL_${statKey.toUpperCase()}`,
        statValue: validation.statValue,
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

    // const foundSessionPlayer = sessionPlayers.find(
    //   (p) => p.playerName === foundPlayer?.playerName,
    // );

    analyzedTeamsData.forEach((team: AnalyzedTeamData) => {
      team.players.valueArray.forEach((player) => {
        const analyzedPlayerValueObject = player.valueObject;

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
      return (
        analyzedTeamsData.find((team) => team.teamName === "Blue")?.players ||
        []
      );
    } else if (orangeTeamGoals > blueTeamGoals) {
      return (
        analyzedTeamsData.find((team) => team.teamName === "Orange")?.players ||
        []
      );
      // TODO - Return proper
    } else {
      return []; // Error in vision results
    }
  } catch (error) {
    console.error("Error calculating RL winners: ", error);
    return [];
  }
};

const calculateTeamWinners = (
  players: VisionPlayer[],
  teamKey: string,
  config: WinnerConfig,
): VisionPlayer[] => {
  console.log("Calculating Team Winners: ", players);

  // Group players by team and calculate team scores
  const teams = players.reduce(
    (acc, player) => {
      const team = player.teamKey;
      if (team) {
        if (!acc[team]) {
          acc[team] = {
            players: [],
            score: 0,
          };
        }

        // Add player to team
        acc[team].players.push(player);

        // Add player's score to team total
        const playerScore = player.stats.find(
          (s) => s.stat === config.winCondition.statName,
        )?.statValue;
        acc[team].score += Number(playerScore || 0);
      }
      return acc;
    },
    {} as Record<string, { players: VisionPlayer[]; score: number }>,
  );

  console.log("Teams in calculateWinners: ", teams);

  if (config.winCondition.comparison === "sum") {
    const teamScores = Object.entries(teams).map(([teamName, teamPlayers]) => {
      const score = teamPlayers.reduce((sum, player) => {
        const statValue = player.stats.find(
          (s) => s.stat === config.winCondition.statName,
        )?.statValue;
        return sum + (Number(statValue) || 0);
      }, 0);
      return { teamName, score, players: teamPlayers };
    });

    const winningTeam = teamScores.reduce(
      (winner, current) => (current.score > winner.score ? current : winner),
      teamScores[0],
    );

    console.log("Winning Team: ", winningTeam);

    return winningTeam.players;
  }
  return [];
};

const calculateIndividualWinner = (
  players: VisionPlayer[],
  config: WinnerConfig,
): VisionPlayer[] => {
  if (config.winCondition.comparison === "highest") {
    return [
      players.reduce((winner, current) => {
        const winnerScore = winner.stats.find(
          (s) => s.stat === config.winCondition.statName,
        )?.statValue;
        const currentScore = current.stats.find(
          (s) => s.stat === config.winCondition.statName,
        )?.statValue;

        return Number(currentScore) > Number(winnerScore) ? current : winner;
      }),
    ];
  }
  return [];
};

export const RocketLeagueProcessor: GameProcessor = {
  processPlayers: function (
    rlTeams: AnalyzedTeamData[],
    sessionPlayers: Player[],
  ) {
    let rocketLeagueVisionResult: VisionResult = {
      players: [],
    };
    let requiresCheck = false;

    console.log("Processing Rocket League Players: ", rlTeams);

    rlTeams.forEach((teamData) => {
      const teamColor =
        RL_TEAM_MAPPING[teamData.teamName as keyof typeof RL_TEAM_MAPPING];
      console.log(`Processing Team: ${teamColor}`);
      console.log("Team Data: ", teamData);

      if (teamColor) {
        const { processedPlayers, reqCheckFlag } = processTeam(
          teamData,
          sessionPlayers,
        );

        console.log(`Processed Player for: ${teamColor}:`, processedPlayers);
        rocketLeagueVisionResult.players.push(...processedPlayers);
        requiresCheck = requiresCheck || reqCheckFlag;
      }
    });

    // // Calculate winners after processing all players
    // const visionWinner = this.calculateWinners(visionResult);
    // visionResult.winner = visionWinner;

    return {
      processedPlayers: rocketLeagueVisionResult.players,
      reqCheckFlag: requiresCheck,
    };
  },

  calculateWinners: (players: VisionPlayer[]): VisionPlayer[] => {
    const config: WinnerConfig = {
      type: "TEAM",
      winCondition: {
        statName: "RL_GOALS",
        comparison: "sum",
      },
    };
    return calculateTeamWinners(players, "TEAM", config);
  },

  validateStats: validateVisionStatValue,

  validateResults: (
    visionPlayers: VisionPlayer[],
    visionWinners: VisionPlayer[],
    requiresCheck: boolean,
  ) => {
    // VisionResult AKA data is  passed into HandleCreateMatchFromVision
    return requiresCheck
      ? {
          status: VisionResultCodes.CheckRequest,
          data: { visionPlayers: visionPlayers, winner: visionWinners },
          message:
            "There was some trouble processing some stats. They have been assigned the most probable value but please check to ensure all stats are correct before submitting.",
        }
      : {
          status: VisionResultCodes.Success,
          data: { visionPlayers: visionPlayers, winner: visionWinners },
          message: "Results have been successfully imported.",
        };
  },
};
