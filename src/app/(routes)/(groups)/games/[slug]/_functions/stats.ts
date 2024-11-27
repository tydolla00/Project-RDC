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
export const calcAvgPerPlayer = (
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
        for (const winner of match.matchWinner) {
          let member = members.get(winner.playerName);
          if (!member)
            members.set(winner.playerName, { matchWins: 1, setWins: 0 });
          else member.matchWins += 1;
        }
      }
      // Calculate Set Wins
      for (const winner of set.setWinner) {
        let member = members.get(winner.playerName);
        if (!member)
          members.set(winner.playerName, { matchWins: 0, setWins: 1 });
        else member.setWins += 1;
      }
    }
  }
  const data = Array.from(members);
  return data;
};

/**
 * Computes the sum per player for a given statName
 * @param placings info about a players placings
 * @returns A map containing a player's amount of 1st place finishes.
 */
export const calcMostPerStat = (
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

  const data = Array.from(members);

  return data;
};

type MembersPerPosition = {
  first: number;
  second: number;
  third: number;
  last: number;
} & {
  [K in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8]?: number;
};
/**
 * Computes per player, the amount of times they've placed first, second, third, and last. Also includes their placing 1 - 8.
 * @param gameId id of the game record.
 * @returns Array of objects containing info about the amount of a player's placings.
 */
export const calcMostPerPlacing = async (gameId: number) => {
  // I calculate it this way because there is a dynamic amount of players in a match,  know how many players are in a mat
  let stat: StatNameValues<StatNames, "POS"> | undefined;
  switch (gameId) {
    case 1:
      stat = "MK8_POS";
      break;
    case 2:
      stat = "COD_POS";
      break;
  }

  if (!stat) return null;

  const sessions = await getMatchesPerGame(gameId, stat!);
  const members = new Map<string, MembersPerPosition>();

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
