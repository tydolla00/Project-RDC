import { StatName } from "prisma/generated/enums";
import { getAllGames } from "prisma/lib/games";
import { getAllMembers } from "prisma/lib/members";
import { findPlayer } from "../app/(routes)/admin/_utils/player-mappings";

/**
 * Returns navigation data for all RDC members.
 *
 * @returns Promise resolving to an array of member navigation objects.
 */
export const getMembersNav = async () => {
  const members = await getAllMembers();

  if (!members.success || !members.data) return [];

  const navMembers: {
    alt: string;
    name: string;
    navName: string;
    url: string;
    src: string;
    desc: string;
    stats: { prop: string; val: string }[];
  }[] = members.data.map((member) => {
    const rdcMember = findPlayer(member.playerName) ?? undefined;
    return {
      alt: rdcMember?.nav?.alt ?? member.playerName,
      name: member.playerName,
      navName: rdcMember?.nav?.name ?? member.playerName,
      url: rdcMember?.nav?.url ?? `/members/${member.playerName.toLowerCase()}`,
      src: rdcMember?.nav?.src ?? "",
      desc: rdcMember?.desc ?? "",
      stats: rdcMember?.stats ?? [],
    };
  });
  return navMembers;
};

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

export const statDescriptions: { [key in StatName]: string } = {
  [StatName.MK8_DAY]: "Mario Kart 8 Days",
  [StatName.MK8_POS]: "Mario Kart 8 Position",
  [StatName.COD_SCORE]: "Call of Duty Score",
  [StatName.COD_KILLS]: "Call of Duty Kills",
  [StatName.COD_DEATHS]: "Call of Duty Deaths",
  [StatName.COD_MELEES]: "Call of Duty Melees",
  [StatName.COD_POS]: "Call of Duty Position",
  [StatName.LC_DEATHS]: "Lethal Company Deaths",
  [StatName.SR_SETS]: "Speedrunners Sets",
  [StatName.SR_WINS]: "Speedrunners Wins",
  [StatName.SR_POS]: "Speedrunners Position",
  [StatName.RL_GOALS]: "Rocket League Goals",
  [StatName.RL_ASSISTS]: "Rocket League Assists",
  [StatName.RL_SAVES]: "Rocket League Saves",
  [StatName.RL_SHOTS]: "Rocket League Shots",
  [StatName.RL_SCORE]: "Rocket League Score",
  [StatName.RL_DAY]: "Rocket League Position",
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
