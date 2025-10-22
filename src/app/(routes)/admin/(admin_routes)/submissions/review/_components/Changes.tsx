import PlayerAvatar from "@/app/(routes)/admin/_components/form/PlayerAvatar";
import { findPlayer } from "@/app/(routes)/admin/_utils/player-mappings";
import { Session } from "../[slug]/page";
import { FormValues } from "@/app/(routes)/admin/_utils/form-helpers";
import { ProposedData } from "@/app/actions/editSession";

type ProposedChange = {
  player: string;
  statName: string;
  oldValue: string;
  newValue: string;
};

function formatChanges(
  oldMatch: Session["sets"][number]["matches"][number],
  newMatch: FormValues["sets"][number]["matches"][number],
): { player: string; changes: ProposedChange[] }[] {
  const grouped = new Map<string, ProposedChange[]>();

  oldMatch.playerSessions.forEach((oldPS, psIdx) => {
    const newPS = newMatch.playerSessions[psIdx];
    if (!newPS) return;
    oldPS.playerStats.forEach((oldStat) => {
      const newStat = newPS.playerStats.find(
        (stat) => Number(stat.statId) === Number(oldStat.statId),
      );
      if (newStat && newStat.statValue !== oldStat.value) {
        const change: ProposedChange = {
          player: newPS.playerSessionName,
          statName: oldStat.gameStat.statName,
          oldValue: oldStat.value,
          newValue: newStat.statValue,
        };
        const key = newPS.playerSessionName;
        const arr = grouped.get(key) ?? [];
        arr.push(change);
        grouped.set(key, arr);
      }
    });
  });

  return Array.from(grouped.entries()).map(([player, changes]) => ({
    player,
    changes,
  }));
}

export const SessionChangesWrapper = ({
  set,
  json,
  setIndex,
}: {
  set: Session["sets"][number];
  json: ProposedData;
  setIndex: number;
}) => {
  return (
    <>
      {set.matches.map((match, matchIdx) => {
        const players = formatChanges(
          match,
          json.proposedData.sets[setIndex].matches[matchIdx],
        );
        if (players.length === 0) return null;

        return (
          <div key={matchIdx} className="mb-4">
            <div className="text-muted-foreground mb-2 text-sm">
              Set {setIndex + 1}, Match {matchIdx + 1}
            </div>
            <Changes players={players} />
          </div>
        );
      })}
    </>
  );
};

export const Changes = ({
  players,
}: {
  players: ReturnType<typeof formatChanges>;
}) => {
  return (
    <>
      {players.map((p, idx) => {
        const player = findPlayer(p.player);
        if (!player) return null;
        return (
          <div key={idx} className="flex items-center gap-4 pl-4">
            <PlayerAvatar player={player} />
            {p.changes.map((change) => {
              return (
                <div className="space-x-2" key={change.statName}>
                  <span className="text-sm font-medium">
                    {change.statName}:
                  </span>
                  <span className="text-red-500 line-through">
                    {change.oldValue}
                  </span>
                  <span className="text-green-500">{change.newValue}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
