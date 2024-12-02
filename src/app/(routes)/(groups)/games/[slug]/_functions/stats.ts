import {
  getWinsPerPlayer,
  getScoreStatsPerPlayer,
  getMatchesPerGame,
  StatNameValues,
  getStatPerPlayer,
} from "../../../../../../../prisma/lib/games";
import { StatNames } from "../../../../../../../prisma/lib/utils";

/**
 * Makes all neccessary requests to the databae.
 * @param game a game record
 * @returns A promise of all prisma functions needed for a page.
 */
export const getAllStats = async (game: {
  gameId: number;
  gameName: string;
}) => {
  let stat:
    | StatNameValues<StatNames, "POS">
    | StatNameValues<StatNames, "SCORE"> = "COD_POS";

  switch (game.gameId) {
    case 1:
      stat = StatNames.MarioKartPosition;
  }

  return await Promise.all([
    getWinsPerPlayer(game!.gameId),
    getScoreStatsPerPlayer(game!.gameId, stat),
  ]).then((data) => ({
    wins: data[0],
    placings: data[1],
  }));
};

/**
 * Computes the average of a players ranking within a game and returns it with the amount of games they've played.
 * @param playerStats @external getScoreStatsPerPlayer
 * @returns Array of Object containing info about the player their placing and matches played.
 */
export const getAverage = (
  playerStats: Awaited<ReturnType<typeof getScoreStatsPerPlayer>>,
) => {
  const avgPlacingPerPlayer = new Map<string, { avg: number; count: number }>();
  // Compute total per player
  for (const playerStat of playerStats) {
    const avg = Number(playerStat.value);
    if (!avg) {
      // TODO Log to Posthog/Sentry
      console.log("Not a number");
      continue;
    }

    let player = avgPlacingPerPlayer.get(playerStat.player.playerName);
    if (!player)
      avgPlacingPerPlayer.set(playerStat.player.playerName, {
        avg,
        count: 1,
      });
    else {
      player.count += 1;
      player.avg += avg;
    }
  }
  // Compute average
  for (const [, val] of avgPlacingPerPlayer) {
    val.avg = Math.round(val.avg / val.count);
  }

  const data = Array.from(avgPlacingPerPlayer, ([key, val]) => ({
    player: key,
    placing: val.avg,
    played: val.count,
  }));

  return data;
};

/**
 * Computes a players match wins and set wins in a given game.
 * @param game game record
 * @returns A map of a player's match wins and setwins.
 */
export const calculateWinsPerPlayer = (
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
  return members;
};

/**
 * Computes the amount of times a player has made first and returns it.
 * @param placings info about a players placings
 * @returns A map containing a player's amount of 1st place finishes.
 */
export const calculateMost1st = (
  placings: {
    value: string;
    player: { playerId: number; playerName: string };
  }[],
) => {
  const members = new Map<string, number>();

  for (const placing of placings) {
    const val = Number(placing.value);
    if (!val || val !== 1) {
      !val && console.log("Not a number", val);
      continue;
    }
    let member = members.get(placing.player.playerName) || 0;
    members.set(placing.player.playerName, ++member);
  }

  return members;
};

/**
 * Computes per player, their second and last place finishes and returns it.
 * @param gameId id of the game record.
 * @returns Array of objects containing info about the amount of a player's second and last place finishes.
 */
export const calculateMostSecondAndLast = async (gameId: number) => {
  let stat: StatNameValues<StatNames, "POS"> | undefined;
  switch (gameId) {
    case 1:
      stat = "MK8_POS";
  }

  if (!stat) return null;

  const sessions = await getMatchesPerGame(gameId, stat!);
  const members = new Map<string, { last: number; second: number }>();

  for (const session of sessions) {
    for (const set of session.sets) {
      for (const match of set.matches) {
        const race = [];
        for (const ps of match.playerSessions) {
          const pos = Number(ps.playerStats[0].value);
          if (!pos) {
            !pos && console.log("Not a number", pos);
            continue;
          }
          race.push({ player: ps.player.playerName, pos });
        }
        const sorted = race.sort((a, b) => a.pos - b.pos);
        const lastPlace = sorted[sorted.length - 1].player;
        const secondPlace = sorted[1].player;

        if (!members.has(lastPlace))
          members.set(lastPlace, { last: 0, second: 0 });
        let member = members.get(lastPlace)!;
        member.last += 1;

        if (!members.has(secondPlace))
          members.set(secondPlace, { last: 0, second: 0 });
        member = members.get(secondPlace)!;
        member.second += 1;
      }
    }
  }
  const data = Array.from(members, ([key, val]) => ({
    player: key,
    last: val.last,
    second: val.second,
  }));
  return data;
};

/**
 * Computes the total of a given stat per player.
 * @param gameId id of the game record.
 * @param statName statname to retrieve from database
 * @returns Computes total of stat per player
 */
export const calculateStatPerPlayer = async (
  gameId: number,
  statName: StatNames,
) => {
  const stats = await getStatPerPlayer(gameId, statName);
  const members = new Map<string, number>();

  for (const { player, value } of stats) {
    const val = Number(value);

    if (!val) {
      console.log("Not a number", val); // May want to do some logging
    }

    let member = members.get(player.playerName) || 0;
    members.set(player.playerName, member + val);
  }

  return members;
};
