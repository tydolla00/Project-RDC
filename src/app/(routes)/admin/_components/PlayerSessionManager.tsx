"use client";
import { Player } from "@prisma/client";
import React from "react";
import { FieldValues, useFieldArray, useFormContext } from "react-hook-form";
import { formSchema } from "./EntryCreatorForm";

interface Props {
  setIndex: number;
  matchIndex: number;
  players: Player[];
}

interface PlayerSessionField {
  playerId: number;
  playerSessionName: string;
}

interface Name {
  name: string;
  required: boolean;
}
export type FormValuesWithNamesArray = {
  namesArray: Name[];
  [key: string]: any;
};

const PlayerSessionManager = (props: Props) => {
  const { setIndex, matchIndex, players } = props;
  const { register, control, getValues } = useFormContext();
  const { append, remove, fields } = useFieldArray<FieldValues, any>({
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

    // Adding new player sessions for each layer
    players.forEach((player) => {
      const playerExists = finalPlayerSessionValues.some(
        (playerSession: any) => player.playerId === playerSession.playerId,
      );
      if (!playerExists) {
        append({
          playerId: player.playerId,
          playerSessionName: player.playerName,
        });
      }
    });

    // Remove player sessions for players that are no longer in the players array
    finalPlayerSessionValues.forEach((session: any, index: number) => {
      const playerExists = players.some(
        (player) => player.playerId === session.playerId,
      );
      if (!playerExists) {
        remove(index);
      }
    });
  }, [props.players, append, getValues, setIndex, matchIndex, players, remove]);

  console.log("Fields: ", fields);

  return (
    <div>
      Player Sessions
      {fields.map((field, sessionIndex) => {
        return (
          <div key={field.id}>
            <label>
              PlayerSession {sessionIndex + 1} Player ID: {field.playerId}
            </label>
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
