import { Player } from "@prisma/client";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import PlayerSessionManager from "./PlayerSessionManager";

interface Props {
  setIndex: number;
}

const MatchManager = (props: Props) => {
  const { register, control, getValues } = useFormContext();
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
    }));
    console.log("Player Sessions: ", playerSessions);
    append({ matchId: "", matchWinner: "", playerSessions: playerSessions });
  };
  console.log("Match Fields: ", fields);
  return (
    <div>
      {fields.map((match, matchIndex) => {
        return (
          <div key={match.id}>
            <label>Match {matchIndex + 1}</label>
            <input
              type="text"
              {...register(`sets.${setIndex}.matches.${matchIndex}.matchId`)}
            />
            <input
              type="text"
              {...register(
                `sets.${setIndex}.matches.${matchIndex}.matchWinner`,
              )}
            />

            <button type="button" onClick={() => remove(matchIndex)}>
              Remove Match
            </button>
            <PlayerSessionManager
              setIndex={setIndex}
              matchIndex={matchIndex}
              players={players}
            />
          </div>
        );
      })}
      <button type="button" onClick={handleNewMatchClick}>
        Add Match
      </button>
    </div>
  );
};

export default MatchManager;
