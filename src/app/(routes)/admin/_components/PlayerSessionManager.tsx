"use client";
import { Player } from "@prisma/client";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface Props {
  setIndex: number;
  matchIndex: number;
  players: Player[];
}

const PlayerSessionManager = (props: Props) => {
  const { setIndex, matchIndex, players } = props;
  const { register, control, getValues } = useFormContext();
  const { append, remove, fields } = useFieldArray({
    name: `sets.${setIndex}.matches${matchIndex}.playerSessions`,
    control,
  });
  console.log(
    `PlayerSessionManager: Set ${setIndex} Match ${matchIndex} Fields:  ${fields}`,
  );

  React.useEffect(() => {
    const finalPlayerSessionValues = getValues(
      `sets.${setIndex}.matches${matchIndex}.playerSessions`,
    );
    console.log(`FinalPlayerSessionValues ${finalPlayerSessionValues} `);

    players.forEach((player) => {
      const playerExists = finalPlayerSessionValues.some(
        (session: any) => player.playerId === session.playerId,
      );
      if (!playerExists) {
        append({
          playerId: player.playerId,
          playerSessionName: player.playerName,
        });
      }
    });
    // props.players.forEach((player) => {
    //   const playerExists = fields.some(
    //     (field) => field.id === player.playerId.toString(),
    //   );
    //   if (!playerExists) {
    //     append({
    //       playerId: player.playerId,
    //       playerSessionName: player.playerName,
    //     });
    //   }
    // });
  }, [props.players, append]);

  console.log("Fields: ", fields);

  return (
    <div>
      Player Sessions
      {fields.map((session, sessionIndex) => {
        return (
          <div key={session.id}>
            <label>PlayerSession {sessionIndex + 1}</label>
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

            <button type="button" onClick={() => remove(sessionIndex)}>
              Remove Player Session
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerSessionManager;
