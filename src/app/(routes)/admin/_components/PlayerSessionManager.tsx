"use client";
import { Player } from "@prisma/client";
import React from "react";
import { FieldValues, useFieldArray, useFormContext } from "react-hook-form";
import PlayerStatManager from "./PlayerStatManager";

interface Props {
  setIndex: number;
  matchIndex: number;
  players: Player[];
}

const PlayerSessionManager = (props: Props) => {
  const { setIndex, matchIndex, players } = props;
  const { register, control, getValues } = useFormContext();
  const { append, remove, fields } = useFieldArray<FieldValues>({
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

    finalPlayerSessionValues?.forEach((element: any) => {
      console.log("Element: ", element);
    });

    // Adding new player sessions for each player
    players.forEach((player) => {
      const playerExists = finalPlayerSessionValues.some(
        (playerSession: any) => player.playerId === playerSession.playerId,
      );
      if (!playerExists) {
        append({
          playerId: player.playerId,
          playerSessionName: player.playerName,
          playerStats: [],
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

  const getPlayerNameFromField = (field: any): boolean => {
    return field?.playerSessionName ?? 0;
  };

  players.forEach((player) => {
    console.log("Player: ", player.playerName);
  });

  return (
    <div>
      Player Sessions
      {fields.map((field, sessionIndex) => {
        return (
          <div className="flex flex-col" key={field.id}>
            <label>{getPlayerNameFromField(field)}</label>
            <input
              type="text"
              {...register(`sets.${setIndex}.matches.${matchIndex}.matchId`)}
            />
            <input
              placeholder="Match Winner"
              type="text"
              {...register(
                `sets.${setIndex}.matches.${matchIndex}.matchWinner`,
              )}
            />

            {/* <button
              className="ml-2 text-red-500"
              type="button"
              onClick={() => remove(sessionIndex)}
            >
              X
            </button> */}
            <PlayerStatManager
              {...props}
              playerSessionIndex={sessionIndex}
              player={{ playerId: 0, playerName: "Scott" }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlayerSessionManager;
