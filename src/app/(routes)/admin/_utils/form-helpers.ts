import { Player } from "@prisma/client";
import { z } from "zod";

export const formSchema = z.object({
  game: z.string(),
  sessionName: z
    .string()
    .min(4, "Session Name must be at least 4 characters")
    .readonly(),
  sessionUrl: z
    .string()
    .toLowerCase()
    .startsWith(
      "https://www.youtube.com",
      "Please paste in a valid youtube url.",
    )
    .max(100),
  date: z.date().readonly(),
  thumbnail: z.string().readonly(),
  players: z.array(
    z.object({
      playerId: z.number(),
      playerName: z.string(),
    }),
  ),
  sets: z
    .array(
      z.object({
        setId: z.number(),
        setWinners: z
          .array(
            z.object({
              playerId: z.number(),
              playerName: z.string(),
            }),
          )
          .min(1, "At least one set winner is required."),
        matches: z.array(
          z.object({
            matchWinners: z
              .array(
                z.object({
                  playerId: z.number(),
                  playerName: z.string(),
                }),
              )
              .min(1, "At least one match winner is required."),
            playerSessions: z
              .array(
                z.object({
                  playerId: z.number(),
                  playerSessionName: z.string(),
                  playerStats: z.array(
                    z.object({
                      statId: z.string(),
                      stat: z.string(),
                      statValue: z.string(),
                    }),
                  ),
                }),
              )
              .min(1, "At least one player session is required"),
          }),
        ),
      }),
    )
    .min(1, "At least one set is required"),
});

// TODO: How to handle type to get the form values more reliably
// TODO Do we want to conditionally apply input types/validations based on the stat name? Most will be numbers
export type FormValues = z.infer<typeof formSchema>;

export interface AdminFormProps {
  rdcMembers: Player[];
}

type PlayerMapping = {
  [key: string]: {
    playerId: number;
    playerName: string;
    gamerTags: string[];
  };
};

export const PLAYER_MAPPINGS: PlayerMapping = {
  Scott: {
    playerId: 1,
    playerName: "Scott",
    gamerTags: ["Silver"],
  },
  Ben: {
    playerId: 2,
    playerName: "Ben",
    gamerTags: ["Des"],
  },
  Dylan: {
    playerId: 3,
    playerName: "Dylan",
    gamerTags: ["Aff"],
  },
  Lee: {
    playerId: 4,
    playerName: "Lee",
    gamerTags: ["Lee"],
  },
  Mark: {
    playerId: 5,
    playerName: "Mark",
    gamerTags: ["Mark"],
  },
};
const playerCache = new Map<string, any>();

// TODO: Fix this
export const findPlayerByGamerTag = (gamerTag: string) => {
  if (playerCache.has(gamerTag)) {
    return playerCache.get(gamerTag);
  }

  const player = Object.values(PLAYER_MAPPINGS).find((player) =>
    player.gamerTags.some(
      (tag) => tag.toLowerCase() === gamerTag.toLowerCase(),
    ),
  );
  return player;
};
