import { $Enums } from "@prisma/client";
import { getAllGames } from "prisma/lib/games";

/**
 * Enum of RDC member names.
 */
export enum MembersEnum {
  Mark = "mark",
  Ipi = "ipi",
  John = "john",
  Aff = "aff",
  Lee = "lee",
  Dylan = "dylan",
  Ben = "ben",
  Des = "des",
}

/**
 * Returns navigation data for all games.
 *
 * @returns Promise resolving to an array of game navigation objects.
 */
export const getGamesNav = async () => {
  const games = await getAllGames();

  if (!games.success || !games.data) return [];

  const navGames: {
    alt?: string;
    name: string;
    url: string;
    src?: string;
    desc?: string;
  }[] = games.data.map((game) => {
    const gameKey = game.gameName.replace(/\s/g, "").toLowerCase() as GamesEnum;
    return {
      alt: game.gameName,
      desc: gamesNav.get(gameKey) || "",
      name: game.gameName,
      url: `/games/${gameKey}`,
      src: `/images/${gameImages[gameKey]}`,
    };
  });
  navGames.push({ name: "Browse all games", url: "/games" });
  return navGames;
};

export enum GamesEnum {
  RocketLeague = "rocketleague",
  LethalCompany = "lethalcompany",
  CallOfDuty = "callofduty",
  MarioKart8 = "mariokart8",
  SpeedRunners = "speedrunners",
}

const gamesNav = new Map<GamesEnum, string>([
  [GamesEnum.RocketLeague, "Stats from the most intense 3v3 battles."],
  [GamesEnum.LethalCompany, "Stats that tell you who touches the most paper."],
  [GamesEnum.CallOfDuty, "Stats for FFA's and who sells the most online."],
  [GamesEnum.MarioKart8, "Stats that tell you who races the hardest."],
  [GamesEnum.SpeedRunners, "Stats that tell you who races the hardest."],
]);

export const gameImages = {
  [GamesEnum.RocketLeague]: "rocketleague.png",
  [GamesEnum.LethalCompany]: "lethalcompany.jpg",
  [GamesEnum.MarioKart8]: "mk8.jpg",
  [GamesEnum.SpeedRunners]: "speedrunners.jpeg",
  [GamesEnum.CallOfDuty]: "callofduty.jpeg",
};

export const statDescriptions: { [key in $Enums.StatName]: string } = {
  [$Enums.StatName.MK8_DAY]: "Mario Kart 8 Days",
  [$Enums.StatName.MK8_POS]: "Mario Kart 8 Position",
  [$Enums.StatName.COD_SCORE]: "Call of Duty Score",
  [$Enums.StatName.COD_KILLS]: "Call of Duty Kills",
  [$Enums.StatName.COD_DEATHS]: "Call of Duty Deaths",
  [$Enums.StatName.COD_MELEES]: "Call of Duty Melees",
  [$Enums.StatName.COD_POS]: "Call of Duty Position",
  [$Enums.StatName.LC_DEATHS]: "Lethal Company Deaths",
  [$Enums.StatName.SR_SETS]: "Speedrunners Sets",
  [$Enums.StatName.SR_WINS]: "Speedrunners Wins",
  [$Enums.StatName.SR_POS]: "Speedrunners Position",
  [$Enums.StatName.RL_GOALS]: "Rocket League Goals",
  [$Enums.StatName.RL_ASSISTS]: "Rocket League Assists",
  [$Enums.StatName.RL_SAVES]: "Rocket League Saves",
  [$Enums.StatName.RL_SHOTS]: "Rocket League Shots",
  [$Enums.StatName.RL_SCORE]: "Rocket League Score",
  [$Enums.StatName.RL_DAY]: "Rocket League Position",
};

export enum errorCodes {
  NotAuthenticated = "Not Authenticated",
  NotAuthorized = "Not Authorized",
}

export enum VisionResultCodes {
  Success = "Success",
  Failed = "Failed",
  CheckRequest = "CheckReq",
}

// Enhanced game configs with stat references
export type GameType = "TEAM" | "SOLO";

export interface GameConfig {
  type: GameType;
  id: number;
  name: string;
  modelId: string;
  supportedStats: string[]; // Field keys for this game
}

export const GAME_CONFIGS: Record<number, GameConfig> = {
  1: {
    type: "SOLO",
    id: 1,
    name: "Mario Kart 8",
    modelId: "RDC-MK8",
    supportedStats: ["mk8_place", "mk8_day"],
  },
  2: {
    type: "TEAM",
    id: 2,
    name: "Rocket League",
    modelId: "RDC-RL",
    supportedStats: [
      "rl_score",
      "rl_goals",
      "rl_assists",
      "rl_saves",
      "rl_shots",
      "rl_day",
    ],
  },
  3: {
    type: "SOLO",
    id: 3,
    name: "Call of Duty",
    modelId: "RDC-COD",
    supportedStats: [
      "cod_score",
      "cod_kills",
      "cod_deaths",
      "cod_pos",
      "cod_melees",
    ],
  },
  4: {
    type: "TEAM",
    id: 4,
    name: "Lethal Company",
    modelId: "RDC-LC",
    supportedStats: ["lc_deaths"],
  },
  5: {
    type: "SOLO",
    id: 5,
    name: "Speed Runners",
    modelId: "RDC-SR",
    supportedStats: ["sr_wins", "sr_sets", "sr_pos"],
  },
};

export const RL_TEAM_MAPPING = {
  BluePlayers: "blueTeam",
  OrangePlayers: "orangeTeam",
} as const;
