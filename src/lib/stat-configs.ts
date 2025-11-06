import { $Enums } from "prisma/generated";

/**
 * Interface describing a stat configuration for a game.
 */
export interface StatConfig {
  id: string;
  name: $Enums.StatName;
  description: string;
  gameId: number;
  fieldKey: string; // The key from Document Intelligence
  displayName: string;
  category?: "performance" | "outcome" | "offensive" | "defensive";
  dataType: "number" | "position" | "boolean";
  validationRules?: {
    min?: number;
    max?: number;
    allowZero?: boolean;
  };
}

/**
 * All stat configurations for supported games, keyed by fieldKey.
 */
export const STAT_CONFIGS: Record<string, StatConfig> = {
  // Mario Kart 8 Stats
  mk8_place: {
    id: "1",
    name: $Enums.StatName.MK8_POS,
    description: "Mario Kart 8 Position",
    gameId: 1,
    fieldKey: "mk8_place",
    displayName: "Position",
    category: "outcome",
    dataType: "position",
    validationRules: { min: 1, max: 8 },
  },
  mk8_day: {
    id: "2",
    name: $Enums.StatName.MK8_DAY,
    description: "Mario Kart 8 Days",
    gameId: 1,
    fieldKey: "mk8_day",
    displayName: "Days Played",
    category: "performance",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },

  // Rocket League Stats
  rl_score: {
    id: "3",
    name: $Enums.StatName.RL_SCORE,
    description: "Rocket League Score",
    gameId: 2,
    fieldKey: "rl_score",
    displayName: "Score",
    category: "performance",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  rl_goals: {
    id: "4",
    name: $Enums.StatName.RL_GOALS,
    description: "Rocket League Goals",
    gameId: 2,
    fieldKey: "rl_goals",
    displayName: "Goals",
    category: "offensive",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  rl_assists: {
    id: "5",
    name: $Enums.StatName.RL_ASSISTS,
    description: "Rocket League Assists",
    gameId: 2,
    fieldKey: "rl_assists",
    displayName: "Assists",
    category: "offensive",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  rl_saves: {
    id: "6",
    name: $Enums.StatName.RL_SAVES,
    description: "Rocket League Saves",
    gameId: 2,
    fieldKey: "rl_saves",
    displayName: "Saves",
    category: "defensive",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  rl_shots: {
    id: "7",
    name: $Enums.StatName.RL_SHOTS,
    description: "Rocket League Shots",
    gameId: 2,
    fieldKey: "rl_shots",
    displayName: "Shots",
    category: "offensive",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  rl_day: {
    id: "8",
    name: $Enums.StatName.RL_DAY,
    description: "Rocket League Days",
    gameId: 2,
    fieldKey: "rl_day",
    displayName: "Days Played",
    category: "performance",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },

  // Call of Duty Stats
  cod_score: {
    id: "9",
    name: $Enums.StatName.COD_SCORE,
    description: "Call of Duty Score",
    gameId: 3,
    fieldKey: "cod_score",
    displayName: "Score",
    category: "performance",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  cod_kills: {
    id: "10",
    name: $Enums.StatName.COD_KILLS,
    description: "Call of Duty Kills",
    gameId: 3,
    fieldKey: "cod_kills",
    displayName: "Kills",
    category: "offensive",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  cod_deaths: {
    id: "11",
    name: $Enums.StatName.COD_DEATHS,
    description: "Call of Duty Deaths",
    gameId: 3,
    fieldKey: "cod_deaths",
    displayName: "Deaths",
    category: "defensive",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  cod_pos: {
    id: "12",
    name: $Enums.StatName.COD_POS,
    description: "Call of Duty Position",
    gameId: 3,
    fieldKey: "cod_pos",
    displayName: "Position",
    category: "outcome",
    dataType: "position",
    validationRules: { min: 1, max: 8 },
  },
  cod_melees: {
    id: "13",
    name: $Enums.StatName.COD_MELEES,
    description: "Call of Duty Melee Kills",
    gameId: 3,
    fieldKey: "cod_melees",
    displayName: "Melee Kills",
    category: "offensive",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },

  // TODO RUN MIGRATION TO ADD THIS STAT ^

  // Lethal Company Stats
  lc_deaths: {
    id: "14",
    name: $Enums.StatName.LC_DEATHS,
    description: "Lethal Company Deaths",
    gameId: 4,
    fieldKey: "lc_deaths",
    displayName: "Deaths",
    category: "outcome",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },

  // Speed Runners Stats
  sr_wins: {
    id: "15",
    name: $Enums.StatName.SR_WINS,
    description: "Speedrunners Wins",
    gameId: 5,
    fieldKey: "sr_wins",
    displayName: "Wins",
    category: "outcome",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  sr_sets: {
    id: "16",
    name: $Enums.StatName.SR_SETS,
    description: "Speedrunners Sets",
    gameId: 5,
    fieldKey: "sr_sets",
    displayName: "Sets",
    category: "performance",
    dataType: "number",
    validationRules: { min: 0, allowZero: true },
  },
  sr_pos: {
    id: "17",
    name: $Enums.StatName.SR_POS,
    description: "Speedrunners Position",
    gameId: 5,
    fieldKey: "sr_pos",
    displayName: "Position",
    category: "outcome",
    dataType: "position",
    validationRules: { min: 1, max: 8 },
  },
};

// Utility functions to work with stat configs
/**
 * Returns the stat config for a given field key.
 * @param fieldKey - The field key to look up.
 * @returns StatConfig or undefined.
 */
export const getStatConfigByFieldKey = (
  fieldKey: string,
): StatConfig | undefined => {
  return STAT_CONFIGS[fieldKey];
};

/**
 * Returns all stat configs for a given game ID.
 * @param gameId - The game ID.
 * @returns Array of StatConfig.
 */
export const getStatConfigsByGame = (gameId: number): StatConfig[] => {
  return Object.values(STAT_CONFIGS).filter((stat) => stat.gameId === gameId);
};

/**
 * Returns all stat configs for a given category.
 * @param category - The stat category.
 * @returns Array of StatConfig.
 */
export const getStatConfigsByCategory = (
  category: StatConfig["category"],
): StatConfig[] => {
  return Object.values(STAT_CONFIGS).filter(
    (stat) => stat.category === category,
  );
};

// TODO: Replace the existing statDescriptions with this derived object
export const statDescriptions: { [key in $Enums.StatName]: string } =
  Object.values(STAT_CONFIGS).reduce(
    (acc, config) => {
      acc[config.name] = config.description;
      return acc;
    },
    {} as { [key in $Enums.StatName]: string },
  );
