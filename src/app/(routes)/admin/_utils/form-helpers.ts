import { $Enums, Player } from "@prisma/client";
import { z } from "zod";

export const formSchema = z.object({
  game: z.string().trim().min(1),
  sessionName: z.string().trim().min(1).max(100).readonly(),
  sessionUrl: z
    .string()
    .url()
    .toLowerCase()
    .trim()
    .min(1)
    .startsWith(
      "https://www.youtube.com",
      "Please paste in a valid youtube url.",
    )
    .max(100),
  videoId: z.string().trim().min(1).readonly(),
  date: z.date({ required_error: "Date is required" }).readonly(),
  thumbnail: z.string().trim().min(1).readonly(),
  players: z
    .array(
      z.object({
        playerId: z.number(),
        playerName: z.string().trim().min(1),
      }),
    )
    .nonempty("At least one player is required"),
  sets: z
    .array(
      z.object({
        setId: z.number(),
        setWinners: z
          .array(
            z.object({
              playerId: z.number(),
              playerName: z.string().trim().min(1),
            }),
          )
          .nonempty("At least one set winner is required"),
        matches: z
          .array(
            z.object({
              matchWinners: z
                .array(
                  z.object({
                    playerId: z.number(),
                    playerName: z.string().trim().min(1),
                  }),
                )
                .nonempty("At least one match winner is required"),
              playerSessions: z
                .array(
                  z.object({
                    playerId: z.number(),
                    playerSessionName: z.string().trim().min(1),
                    playerStats: z
                      .array(
                        z.object({
                          statId: z.string().trim().min(1),
                          stat: z.string().trim().min(1),
                          statValue: z.string().trim().min(1).max(100),
                        }),
                      )
                      .nonempty("At least one player stat is required"),
                  }),
                )
                .nonempty("At least one player session is required"),
            }),
          )
          .nonempty("At least one match is required")
          .refine(
            (data) => {
              // TODO figure out how to pass this as a param. Maybe explicitly define type.
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
                    `Error in match ${i + 1}. Winning team should have more goals. Winners: ${winningTeam} Losers: ${winningTeam}`,
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
    .nonempty("At least one set is required"),
});

// TODO Do we want to conditionally apply input types/validations based on the stat name? Most will be numbers
export type FormValues = z.infer<typeof formSchema>;

export type Matches = FormValues["sets"][number]["matches"];
export type MatchWinners =
  FormValues["sets"][number]["matches"][number]["matchWinners"];
export type PlayerSessions =
  FormValues["sets"][number]["matches"][number]["playerSessions"];
export type SetWinners = FormValues["sets"][number]["setWinners"];

type PlayerMapping = {
  [key: string]: {
    playerId: number;
    playerName: string;
    gamerTags: string[];
  };
};

// TODO: Fuzzy Matching
export const PLAYER_MAPPINGS: PlayerMapping = {
  Mark: {
    playerId: 1,
    playerName: "Mark",
    gamerTags: ["SupremeMvp0020", "SupremeMvp 0020"],
  },
  Dylan: {
    playerId: 2,
    playerName: "Dylan",
    gamerTags: ["Dpatel254", "Opatel254", "L. Opatel254"],
  },
  Ben: {
    playerId: 3,
    playerName: "Ben",
    gamerTags: ["Jabenixem"],
  },
  Lee: {
    playerId: 4,
    playerName: "Lee",
    gamerTags: ["Leland12123", "Leland23"],
  },
  Des: {
    playerId: 5,
    playerName: "Des",
    gamerTags: [
      "13RUTALxPANIiC",
      "13RUTALxPANIC",
      "IBRUTALxPANIiC",
      "IBRUTALXPANIIC",
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
