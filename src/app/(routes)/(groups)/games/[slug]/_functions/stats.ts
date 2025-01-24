import { StatName } from "@prisma/client";
import {
  getWinsPerPlayer,
  getMatchesPerGame,
  StatEndsWith,
  getStatPerPlayer,
  getSumPerStat,
} from "../../../../../../../prisma/lib/games";
import { StatNames } from "../../../../../../../prisma/lib/utils";
import PostHogClient from "@/lib/posthog";

/**
 * Fetches the sum and average of each stat from the database.
 * @param playerId id of the player
 * @returns An array of objects for each member in the order [goals, assists, saves, score, days]
 */
export const getRLStats = async (playerId: number) =>
  await Promise.all([
    (await getSumPerStat(playerId, StatNames.RLGoals)).at(0),
    (await getSumPerStat(playerId, StatNames.RLAssists)).at(0),
    (await getSumPerStat(playerId, StatNames.RLSaves)).at(0),
    (await getSumPerStat(playerId, StatNames.RLScore)).at(0),
    (await getSumPerStat(playerId, StatNames.RLDay)).at(0),
  ]);

/**
 * Computes set wins and match wins for each player.
 * @param game game record
 * @returns Array of object containing info about the amount of match and set wins a player has.
 */
export const calcWinsPerPlayer = (
  game: NonNullable<Awaited<ReturnType<typeof getWinsPerPlayer>>>,
) => {
  const members = new Map<string, { matchWins: number; setWins: number }>();

  for (const session of game.sessions) {
    for (const set of session.sets) {
      // Calculate Match Wins
      for (const match of set.matches) {
        for (const winner of match.matchWinners) {
          let member = members.get(winner.playerName);
          if (!member)
            members.set(winner.playerName, { matchWins: 1, setWins: 0 });
          else member.matchWins += 1;
        }
      }
      // Calculate Set Wins
      for (const winner of set.setWinners) {
        let member = members.get(winner.playerName);
        if (!member)
          members.set(winner.playerName, { matchWins: 0, setWins: 1 });
        else member.setWins += 1;
      }
    }
  }
  const data = Array.from(members, ([key, val]) => ({
    player: key,
    matchWins: val.matchWins,
    setWins: val.setWins,
  }));
  return data;
};

type MembersPerPosition = {
  first: number;
  second: number;
  third: number;
  last: number;
} & FirstThroughEighth;

type FirstThroughEighth = {
  [K in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8]?: number;
};
/**
 * Computes per player, the amount of times they've placed first, second, third, and last. Also includes their placing 1 - 8.
 * @param gameId id of the game record.
 * @param statName statName of the stat you are checking.
 * @returns Array of objects containing info about a player's placings.
 */
export const calcMostPerPlacing = async (
  gameId: number,
  statName: StatEndsWith<"POS">,
) => {
  const sessions = await getMatchesPerGame(gameId, statName);
  const members = new Map<string, MembersPerPosition>();
  const posthog = PostHogClient();

  for (const session of sessions) {
    for (const set of session.sets) {
      for (const match of set.matches) {
        const race = [];
        for (const ps of match.playerSessions) {
          const pos = Number(ps.playerStats[0].value);
          if (isNaN(pos)) {
            posthog.capture({
              event: `NaN called in calcMostPerPlacing val: ${pos}`,
              distinctId: new Date().toUTCString(),
            });
            console.log("Not a number", pos);
            continue;
          }
          if (!members.has(ps.player.playerName))
            members.set(ps.player.playerName, {
              first: 0,
              second: 0,
              third: 0,
              last: 0,
            });
          let member = members.get(ps.player.playerName)!;
          member[pos as keyof MembersPerPosition] ??= 0;
          member[pos as keyof MembersPerPosition] += 1;
          race.push({ player: ps.player.playerName, pos });
        }
        const sorted = race.sort((a, b) => a.pos - b.pos);
        const firstPlace = sorted[0].player;
        const secondPlace = sorted[1].player;
        const thirdPlace = sorted[2].player;
        const lastPlace = sorted[sorted.length - 1].player;

        let member = members.get(firstPlace)!;
        member.first += 1;

        member = members.get(secondPlace)!;
        member.second += 1;

        member = members.get(thirdPlace)!;
        member.third += 1;

        member = members.get(lastPlace)!;
        member.last += 1;
      }
    }
  }
  const data = Array.from(members, ([key, val]) => ({
    player: key,
    first: val.first,
    second: val.second,
    third: val.third,
    last: val.last,
    1: val[1] || 0,
    2: val[2] || 0,
    3: val[3] || 0,
    4: val[4] || 0,
    5: val[5] || 0,
    6: val[6] || 0,
    7: val[7] || 0,
    8: val[8] || 0,
  }));
  posthog.shutdown();
  return data;
};

/**
 * Computes the total of a given stat per player.
 * @param gameId id of the game record.
 * @param statName statName of the stat you are checking for.
 * @returns Computes total of stat per player
 */
export const calcStatPerPlayer = async (gameId: number, statName: StatName) => {
  const stats = await getStatPerPlayer(gameId, statName);
  console.log(stats);
  const members = new Map<string, number>();
  const posthog = PostHogClient();

  for (const { player, value } of stats) {
    const val = Number(value);

    if (isNaN(val)) {
      posthog.capture({
        event: `NaN called in calculateStatPerPlayer val: ${val}`,
        distinctId: new Date().toUTCString(),
      });
      console.log("Not a number", val);
      continue;
    }

    let member = members.get(player.playerName) || 0;
    members.set(player.playerName, member + val);
  }
  const data = Array.from(members, ([key, val]) => ({ player: key, val }));
  posthog.shutdown();
  return data;
};
