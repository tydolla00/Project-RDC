import {
  AnalyzedPlayer,
  AnalyzedPlayersObj,
  AnalyzedTeamData,
  Stat,
  VisionPlayer,
} from "@/app/actions/visionAction";
import { Player } from "@prisma/client";
import { VisionResultCodes } from "./constants";
import {
  findPlayerByGamerTag,
  PlayerNotFoundError,
} from "@/app/(routes)/admin/_utils/form-helpers";

type WinnerType = "TEAM" | "INDIVIDUAL";

export interface WinnerConfig {
  type: WinnerType;
  winCondition: {
    statName: string;
    comparison: "highest" | "lowest" | "sum";
  };
}

export type GameProcessor = {
  /**
   * Process players from the vision data and return a list of processed players (VisionPlayer)
   * @param playerData - The player data to process
   * @param sessionPlayers - The session players to validate against
   * @returns An object containing processed players and a flag indicating if a check is required
   */
  processPlayers: (
    playerData: AnalyzedTeamData[] | AnalyzedPlayersObj[], // Use a union type here
    sessionPlayers: Player[],
  ) => { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean };
  /**
   * Calculate winners based on the processed players' stats and the game configuration
   * @param players - The processed players
   * @returns An array of winning players
   */
  calculateWinners: (players: VisionPlayer[]) => VisionPlayer[];
  /**
   * To be used for validating stats of processed players (VisionPlayer)
   * @param statValue
   * @param numPlayers = number of players in the match for validations based on player count/team size
   * @returns
   */
  validateStats: (
    statValue: string | undefined,
    numPlayers?: number,
  ) => {
    statValue: string;
    reqCheck: boolean;
  };
  /**
   * Final check Validate the results of the game based on the processed players and winners
   * @param visionPlayers - The processed players
   * @param winners - The winning players
   * @param requiresCheck - Flag indicating if a check is required
   * @returns An object containing the status, data, and message
   */
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

export const processTeam = (
  teamData: AnalyzedTeamData,
  sessionPlayers: Player[],
): { processedPlayers: VisionPlayer[]; reqCheckFlag: boolean } => {
  console.log("Processing Team: ", teamData.players);
  let reqCheckFlag = false;

  // Process Players
  try {
    const processedPlayers =
      teamData.players.valueArray?.map((player) => {
        console.log(
          `Processing Player: ${player.valueObject.PlayerName.content} for ${teamData.teamName}`,
        );
        const processedPlayer = processPlayer(player, teamData.teamName);
        console.log("Processed Player: ", processedPlayer);
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

export const validateProcessedPlayer = (
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
        teamKey: processedPlayer.teamKey,
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

export const processPlayer = (
  player: AnalyzedPlayer,
  teamName?: string,
): ProcessedPlayer => {
  console.log("Processing Player: ", player);

  const statValidations = Object.entries(player.valueObject).reduce(
    (acc, [fieldName, field]) => {
      // Skip PlayerName field
      if (fieldName !== "PlayerName") {
        // Add validation for each stat
        console.log("Processing field: ", fieldName);
        acc[fieldName.toLowerCase()] = validateVisionStatValue(field.content);
      }
      return acc;
    },
    {} as Record<string, { statValue: string; reqCheck: boolean }>,
  );

  const reqCheckFlag = Object.values(statValidations).some((v) => v.reqCheck);

  // Map to RL stat IDs - This could be moved to a config
  /**
   * Stat Mapping from Document Intelligence Model fields to DB stat names
   */
  const statMapping: Record<string, { id: string; name: string }> = {
    mk8_place: { id: "1", name: "MK8_POS" },
    rl_score: { id: "3", name: "RL_SCORE" },
    rl_goals: { id: "4", name: "RL_GOALS" },
    rl_assists: { id: "5", name: "RL_ASSISTS" },
    rl_saves: { id: "6", name: "RL_SAVES" },
    rl_shots: { id: "7", name: "RL_SHOTS" },
    cod_score: { id: "9", name: "COD_SCORE" },
    cod_kills: { id: "10", name: "COD_KILLS" },
    cod_deaths: { id: "11", name: "COD_DEATHS" },
    // cod_pos: { id: "12", name: "COD_POS" }, # Calculate from kills
    cod_melees: { id: "13", name: "COD_MELEES" },
  };

  return {
    reqCheckFlag,
    playerData: {
      name: player.valueObject?.PlayerName?.content || "Unknown",
      stats: Object.entries(statValidations).map(([statKey, validation]) => ({
        statId: statMapping[statKey]?.id || "0",
        stat: statMapping[statKey]?.name || `RL_${statKey.toUpperCase()}`, // TODO: Append game specific prefix
        statValue: validation.statValue,
      })),
    },
    teamKey: teamName,
  };
};

// This is essentially validateRLStatValue
export const validateVisionStatValue = (
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

export const calculateTeamWinners = (
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
      const score = teamPlayers.players.reduce((sum, player) => {
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

    return winningTeam.players.players;
  }
  return [];
};

export const calculateIndividualWinner = (
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
  if (config.winCondition.comparison === "lowest") {
    console.log("Calculating lowest winner");
    return [
      players.reduce((winner, current) => {
        const winnerScore = winner.stats.find(
          (s) => s.stat === config.winCondition.statName,
        )?.statValue;
        const currentScore = current.stats.find(
          (s) => s.stat === config.winCondition.statName,
        )?.statValue;

        return Number(currentScore) < Number(winnerScore) ? current : winner;
      }),
    ];
  }
  return [];
};

export function isAnalyzedTeamDataArray(
  data: AnalyzedTeamData[] | AnalyzedPlayersObj[],
): data is AnalyzedTeamData[] {
  return (data as AnalyzedTeamData[])[0]?.teamName !== undefined;
}
