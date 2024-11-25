import { Player } from "@prisma/client";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import PlayerSessionManager from "./PlayerSessionManager";
import PlayerSelector from "./PlayerSelector";
import { FormValues } from "./EntryCreatorForm";

interface Props {
  setIndex: number;
}

const MatchManager = (props: Props) => {
  const { register, control, getValues } = useFormContext<FormValues>();
  const { setIndex } = props;
  const { append, remove, fields } = useFieldArray({
    name: `sets.${setIndex}.matches`,
    control,
  });
  const players = getValues(`players`);

  const handleNewMatchClick = () => {
    console.log("Handling New Match click", players);
    const playerSessions = players.map((player: Player) => ({
      playerId: player.playerId,
      playerSessionName: player.playerName,
      playerStats: [],
    }));
    console.log("Player Sessions: ", playerSessions);
    append({
      matchWinner: [],
      playerSessions: playerSessions,
    });
  };
  console.log("Match Fields: ", fields);
  return (
    <div>
      {fields.map((match, matchIndex) => {
        return (
          <div key={match.id} className="flex flex-col justify-between">
            <div id="match-manager-header" className="flex justify-between">
              <label>Match {matchIndex + 1}</label>
              <button
                className="text-red-400 underline underline-offset-2"
                type="button"
                onClick={() => remove(matchIndex)}
              >
                Remove Match
              </button>
            </div>
            <Separator className="my-4 h-[1px] bg-slate-400" />
            <PlayerSessionManager
              setIndex={setIndex}
              matchIndex={matchIndex}
              players={players}
            />
            Match Winner for Match {matchIndex + 1}
            <Controller
              name={`sets.${setIndex}.matches.${matchIndex}.matchWinner`}
              control={control}
              render={({ field }) => (
                <PlayerSelector
                  rdcMembers={players}
                  control={control}
                  field={field}
                />
              )}
            />
          </div>
        );
      })}
      <button
        className="bg-slate-100"
        type="button"
        onClick={handleNewMatchClick}
      >
        Add Match
      </button>
    </div>
  );
};

export default MatchManager;
