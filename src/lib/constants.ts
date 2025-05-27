import { $Enums } from "@prisma/client";
import { getAllGames } from "../../prisma/lib/games";
import { getAllMembers } from "../../prisma/lib/members";

export const getMembersNav = async () => {
  const members = await getAllMembers();

  const navMembers: {
    alt: string;
    name: string;
    navName: string;
    url: string;
    src: string;
    desc: string;
    stats: { prop: string; val: string }[];
  }[] = members.map((member) => {
    const memberKey = member.playerName.toLowerCase();
    const rdcMember = RDCMembers.get(memberKey as MembersEnum)!;
    return {
      alt: rdcMember.nav.alt,
      name: member.playerName,
      navName: rdcMember.nav.name,
      url: rdcMember.nav.url,
      src: rdcMember.nav.src,
      desc: rdcMember.desc,
      stats: rdcMember.stats,
    };
  });
  return navMembers;
};

// TODO Replace src with player avatars
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

const RDCMembers = new Map<MembersEnum, MembersProps>([
  [
    MembersEnum.Mark,
    {
      nav: {
        alt: "RDC Mark",
        name: "Cash Money Mawk",
        url: "/members/mark",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/f/f2/Mark-Phillips.jpg/revision/latest/thumbnail/width/360/height/450?cb=20191004005953",
      },
      desc: "Director, animator, Mark is the founder and creator of RDC. He is one of the better gamers in RDC and plays as such.",
      stats: [
        { prop: "Best Rocket League Player", val: "#1" },
        { prop: "Dragon Ball Sparking Zero", val: "#2" },
        { prop: "Scariest Gamer", val: "Most deaths in Lethal Company" },
      ],
    },
  ],
  [
    MembersEnum.Ipi,
    {
      nav: { alt: "Ipi", name: "Iceman Ip", url: "/members/ipi", src: "" },
      desc: "Ipi is a newcomer in the eyes of RDC, while not yet an official member of RDC yet, one can assume that it's only a matter of time as he has been beating down the crew in Golf and Mario Kart.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    MembersEnum.John,
    {
      nav: { alt: "RDC John", name: "J.O.H.N.", url: "/members/john", src: "" },
      desc: "If you've ever seen or been to DreamCon, this man has had a hand in it. Don't let his sorry gaming skills fool you, John is very valuable in the backend and his contributions should not go unnoticed. Don't forget his immaculate singing ability, John is clearly the best singer in RDC.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    MembersEnum.Aff,
    {
      nav: {
        alt: "RDC Aff",
        name: "Aff",
        url: "/members/aff",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/f/f7/DtlKwRJW4AI3qrN_Aff.jpg/revision/latest?cb=20191004012842",
      },
      desc: "Aff and his turtle bring a lot to RDC. Give aff for giving us all the laughs, memes, and behind the scenes work that he contributes to.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    MembersEnum.Lee,
    {
      nav: {
        alt: "RDC Leland",
        name: "Meland",
        url: "/members/lee",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/e/ee/Leland-manigo-image.jpg/revision/latest?cb=20240119040253",
      },
      desc: "I love it when you talk to me, my cash machine, my cash machine. The old man laugh always get us. While Leland is really sorry at most games, don't try to play him in any fighting game. You are most likely to get beat up.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    MembersEnum.Dylan,
    {
      nav: {
        alt: "RDC Dylan",
        name: "The Big Dyl",
        src: "",
        url: "/members/dylan",
      },
      desc: "The tech guru, the thriller in manilla, el luchador. Dylan is a huge component in the puzzle that is RDC. The flawless streams are thanks to Dylan. He is one of the top gamers in the group although recently he has been falling lower in the ranking of rdc members.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    MembersEnum.Ben,
    {
      nav: {
        alt: "RDC Ben",
        name: "LaBen James",
        url: "/members/ben",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/0/0a/Ben.jpg/revision/latest?cb=20240119050707",
      },
      desc: "Ben is a very average gamer. Somethings he is good at and other's hes not. It's hard to explain. Ben gets it done. He works well and if he leaves again he's dead to us.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    MembersEnum.Des,
    {
      nav: {
        alt: "RDC Des",
        name: "Old Man Des",
        url: "/members/des",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/6/62/Desmond-johnson-4.jpg/revision/latest?cb=20191004011638",
      },
      desc: "How greeeeeeeat is our God. Ranking as the 2nd best singer in RDC Desmond is surprisingly a very good gamer. You would think the dementia would affect Des but the rage and enthusiasm he plays with always uplifts him in the end. Also Desmond, how is Crystal?",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
]);

export const getGamesNav = async () => {
  const games = await getAllGames();

  const navGames: {
    alt?: string;
    name: string;
    url: string;
    src?: string;
    desc?: string;
  }[] = games.map((game) => {
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

export enum errorCodes {
  NotAuthenticated = "Not Authenticated",
}

export enum VisionResultCodes {
  Success = "Success",
  Failed = "Failed",
  CheckRequest = "CheckReq",
}

type MembersProps = {
  desc: string;
  nav: { alt: string; name: string; url: string; src: string };
  stats: { prop: string; val: string }[]; // TODO: Grab stats from database
};

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
// TODO: Export this to a separate file if it grows too large (Which it has already)
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
export const getStatConfigByFieldKey = (
  fieldKey: string,
): StatConfig | undefined => {
  return STAT_CONFIGS[fieldKey];
};

export const getStatConfigsByGame = (gameId: number): StatConfig[] => {
  return Object.values(STAT_CONFIGS).filter((stat) => stat.gameId === gameId);
};

export const getStatConfigsByCategory = (
  category: StatConfig["category"],
): StatConfig[] => {
  return Object.values(STAT_CONFIGS).filter(
    (stat) => stat.category === category,
  );
};

// Replace the existing statDescriptions with this derived object
export const statDescriptions: { [key in $Enums.StatName]: string } =
  Object.values(STAT_CONFIGS).reduce(
    (acc, config) => {
      acc[config.name] = config.description;
      return acc;
    },
    {} as { [key in $Enums.StatName]: string },
  );

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
