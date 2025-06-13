import { $Enums, Player } from "@prisma/client";
import { z } from "zod/v4";

// Session Schema Definitions
const gameSchema = z.union([
  z.literal([
    "Rocket League",
    "Call of Duty",
    "Mario Kart 8",
    "Lethal Company",
    "Speedrunners",
  ]),
  z.string().min(1, "Game is required"),
]);
const sessionNameSchema = z
  .string()
  .trim()
  .min(1, "Session name is required")
  .max(100)
  .readonly();
// TODO Add logic to surface error since other fields aren't being shown
const sessionUrlSchema = z
  .url("Session URL must be a valid URL")
  .toLowerCase()
  .trim()
  .min(1, "Session URL is required")
  .startsWith("https://www.youtube.com", "Please paste in a valid youtube url.")
  .max(100);
const videoIdSchema = z.string().trim().min(1).readonly();
const dateSchema = z.date({ error: "Date is required" }).readonly();
const thumbnailSchema = z.string().trim().min(1).readonly();

// ! End of Session Schema Definitions

const playerSchema = z.object({
  playerId: z.int(),
  playerName: z.literal([
    "Mark",
    "Dylan",
    "Ben",
    "Lee",
    "Des",
    "John",
    "Aff",
    "Ipi",
  ]),
});
const playersSchema = z
  .array(playerSchema)
  .nonempty("At least one player is required");

// Stat Schema Definitions

// ? Rocket League
const rocketLeagueStats = z.object({
  statId: z.string().trim().min(1, "StatId is required"),
  stat: z.literal([
    $Enums.StatName.RL_GOALS,
    $Enums.StatName.RL_ASSISTS,
    $Enums.StatName.RL_SAVES,
    $Enums.StatName.RL_SHOTS,
    $Enums.StatName.RL_SCORE,
  ]),
  statValue: z
    .string()
    .trim()
    .min(1, "Stat value is required")
    .regex(/^\d+$/, "Stat value must be a number")
    .nonempty("Required")
    .transform((val) => String(parseInt(val) || 0)),
});

// ? Mario Kart 8

const marioKart8Stats = z.object({
  statId: z.string().trim().min(1, "StatId is required"),
  stat: z.literal($Enums.StatName.MK8_POS),
  statValue: z
    .string()
    .trim()
    .min(1, "Stat value is required")
    .regex(/^\d+$/, "Stat value must be a number")
    .transform((val) => String(parseInt(val) || 0)),
});

// ? COD

const codStats = z.object({
  statId: z.string().trim().min(1, "StatId is required"),
  stat: z.literal([
    $Enums.StatName.COD_KILLS,
    $Enums.StatName.COD_DEATHS,
    $Enums.StatName.COD_POS,
    $Enums.StatName.COD_SCORE,
  ]),
  statValue: z
    .string()
    .trim()
    .min(1, "Stat value is required")
    .regex(/^\d+$/, "Stat value must be a number")
    .transform((val) => String(parseInt(val) || 0)),
});

// Stat Schema Union
const statSchema = z.discriminatedUnion("stat", [
  rocketLeagueStats,
  marioKart8Stats,
  codStats,
]);

// ! End of Stat Schema Definitions

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

const playerSessionSchema = z.object({
  playerId: z.int(),
  playerSessionName: z.string().trim().min(1),
  playerStats: z
    .array(statSchema)
    .nonempty("At least one player stat is required"),
});

const matchSchema = z.object({
  matchWinners: z
    .array(playerSchema)
    .nonempty("At least one match winner is required"),
  playerSessions: z
    .array(playerSessionSchema)
    .nonempty("At least one player session is required"),
});

const matchesSchema = z
  .array(matchSchema)
  .nonempty("At least one match is required");

const setSchema = z.object({
  setId: z.int(),
  setWinners: z
    .array(playerSchema)
    .nonempty("At least one set winner is required"),
  matches: matchesSchema,
});

const setsSchema = z.array(setSchema).nonempty("At least one set is required");

// Base schema for common fields
const baseSessionSchema = z.object({
  game: gameSchema,
  sessionName: sessionNameSchema,
  sessionUrl: sessionUrlSchema,
  videoId: videoIdSchema,
  date: dateSchema,
  thumbnail: thumbnailSchema,
  players: playersSchema,
  sets: z.array(setSchema).nonempty("At least one set is required"),
});

const rocketLeagueSchema = baseSessionSchema.extend({
  game: z.literal("Rocket League"),
  sets: z
    .array(
      setSchema.extend({
        matches: z.array(matchSchema).refine(
          (data) => {
            return data.every((match, i) => {
              let winningTeam = 0;
              let losingTeam = 0;

              match.playerSessions.forEach((ps) => {
                const onWinningTeam = match.matchWinners.some(
                  (mw) => mw.playerId === ps.playerId,
                );
                ps.playerStats.forEach((stat) => {
                  if (stat.stat === $Enums.StatName.RL_GOALS) {
                    if (onWinningTeam)
                      winningTeam += Number(stat.statValue) || 0;
                    else losingTeam += Number(stat.statValue) || 0;
                  }
                });
              });
              if (winningTeam <= losingTeam)
                console.warn(
                  `Error in match ${i + 1}. Winning team should have more goals. Winners: ${winningTeam} Losers: ${losingTeam}`,
                );
              return winningTeam > losingTeam;
            });
          },
          {
            message: "Winning team should have more goals in each match",
          },
        ),
      }),
    )
    .nonempty(),
});

const marioKart8MatchSchema = baseSessionSchema.extend({
  game: z.literal("Mario Kart 8"),
  sets: z.array(
    setSchema.extend({
      matches: z.array(matchSchema).refine(
        (data) => {
          return data.every((match, i) => {
            let passed = true;
            match.playerSessions.forEach((ps) => {
              ps.playerStats.forEach((stat) => {
                if (
                  stat.stat === $Enums.StatName.MK8_POS &&
                  parseInt(stat.statValue) === 1
                ) {
                  passed =
                    match.matchWinners.length === 1 &&
                    match.matchWinners.some((p) => p.playerId === ps.playerId);
                }
              });
            });
            return passed;
          });
        },
        { error: "The first placed player must be the only match winner." },
      ),
    }),
  ),
});

const lethalCompanySchema = baseSessionSchema.extend({
  game: z.literal("Lethal Company"),
});

const speedrunnersSchema = baseSessionSchema.extend({
  game: z.literal("Speedrunners"),
});
// Other game schemas...
const defaultGameSchema = baseSessionSchema.extend({
  game: z.literal("Call of Duty"),
  sets: setsSchema,
});

// ! End of Game specific schemas

// Combined schema with discriminated union
export const formSchema = z.discriminatedUnion("game", [
  defaultGameSchema,
  rocketLeagueSchema,
  marioKart8MatchSchema,
  lethalCompanySchema,
  speedrunnersSchema,
]);

// Define types based on the Zod schema
export type FormValues = z.infer<typeof formSchema>;

// Derive specific types from the FormValues type
export type Match = FormValues["sets"][number]["matches"][number];
export type MatchWinners = Match["matchWinners"];
export type PlayerSessions = Match["playerSessions"];
export type SetWinners = FormValues["sets"][number]["setWinners"];

type PlayerMapping = {
  [key in z.infer<typeof playerSchema>["playerName"]]: {
    playerId: number;
    playerName: string;
    gamerTags: string[];
  };
};

// TODO: Fuzzy Matching
export const PLAYER_MAPPINGS: PlayerMapping & {} = {
  Mark: {
    playerId: 1,
    playerName: "Mark",
    gamerTags: [
      "SupremeMvp0020",
      "SupremeMvp 0020",
      "Mark",
      "SupremeMvp0020#4772468",
    ],
  },
  Dylan: {
    playerId: 2,
    playerName: "Dylan",
    gamerTags: [
      "Dpatel254",
      "Opatel254",
      "L. Opatel254",
      "Dylan",
      "RdcDylan#2869564",
    ],
  },
  Ben: {
    playerId: 3,
    playerName: "Ben",
    gamerTags: ["Jabenixem", "Ben"],
  },
  Lee: {
    playerId: 4,
    playerName: "Lee",
    gamerTags: [
      "Leland12123",
      "Leland23",
      "Leland",
      "Lee",
      "MysticLeland#1739668",
    ],
  },
  Des: {
    playerId: 5,
    playerName: "Des",
    gamerTags: [
      "13RUTALxPANIiC",
      "13RUTALxPANIC",
      "IBRUTALxPANIiC",
      "IBRUTALXPANIIC",
      "Desmond",
      "Des",
      "Des#5052521",
    ],
  },
  John: {
    playerId: 6,
    playerName: "John",
    gamerTags: ["I will never forget that day in Lockdown..."],
  },
  Aff: {
    playerId: 7,
    playerName: "Aff",
    gamerTags: ["Aff"],
  },
  Ipi: {
    playerId: 8,
    playerName: "Ipi",
    gamerTags: ["iceman_ip"],
  },
};

// TODO: Fix this
export const findPlayerByGamerTag = (gamerTag: string) => {
  const player = Object.values(PLAYER_MAPPINGS).find((player) =>
    player.gamerTags.some(
      (tag) => tag.toLowerCase() === gamerTag.toLowerCase(),
    ),
  );
  return {
    playerId: player?.playerId,
    playerName: player?.playerName,
  } as Player;
};

export class PlayerNotFoundError extends Error {
  constructor(playerName: string) {
    super(`Player not found: ${playerName}`);
    this.name = "PlayerNotFoundError";
  }
}
