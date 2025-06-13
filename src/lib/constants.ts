import { $Enums } from "@prisma/client";
import { getAllGames } from "../../prisma/lib/games";
import { getAllMembers } from "../../prisma/lib/members";
import { capitalizeFirst } from "./utils";

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

export const memberImages = new Map<MembersEnum, string>([
  [capitalizeFirst(MembersEnum.Mark), "mark_rdc.jpg"],
  [capitalizeFirst(MembersEnum.Dylan), "dylan_rdc.jpg"],
  [capitalizeFirst(MembersEnum.Ben), "ben_rdc.jpg"],
  [capitalizeFirst(MembersEnum.Lee), "leland_rdc.jpg"],
  [capitalizeFirst(MembersEnum.Des), "desmond_rdc.jpg"],
  [capitalizeFirst(MembersEnum.John), "john_rdc.jpg"],
  [capitalizeFirst(MembersEnum.Aff), "aff_rdc.jpg"],
  [capitalizeFirst(MembersEnum.Ipi), "ipi_rdc.jpg"],
]);

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
