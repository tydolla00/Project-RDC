import { Player } from "@prisma/client";
import React from "react";
import { FieldValues, useFieldArray, useFormContext } from "react-hook-form";
import PlayerStatManager from "./PlayerStatManager";
import { Label } from "@/components/ui/label";

interface Props {
  setIndex: number;
  matchIndex: number;
  players: Player[];
  statName: string;
}

const PlayerSessionManager = (props: Props) => {
  const { setIndex, matchIndex, players, statName: gameStat } = props;
  const { control, getValues } = useFormContext();
  const { append, remove, fields } = useFieldArray<FieldValues>({
    name: `sets.${setIndex}.matches.${matchIndex}.playerSessions`,
    control,
  });

  React.useEffect(() => {
    const finalPlayerSessionValues = getValues(
      `sets.${setIndex}.matches.${matchIndex}.playerSessions`,
    );

    // -- Logging --
    // finalPlayerSessionValues?.forEach((element: any) => {
    //   console.log("Element: ", element);
    // });

    // Add new PlayerSession for each Player
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
    finalPlayerSessionValues.forEach((playerSession: any, index: number) => {
      const playerExists = players.some(
        (player) => player.playerId === playerSession.playerId,
      );
      if (!playerExists) {
        remove(index);
      }
    });
  }, [props.players, append, getValues, setIndex, matchIndex, players, remove]);

  const getPlayerNameFromField = (field: any): boolean => {
    return field?.playerSessionName ?? 0;
  };

  console.log("PlayerSessionManager Fields: ", fields);

  return (
    <div className="flex flex-wrap gap-5">
      {fields.map((field, sessionIndex) => {
        return (
          <div className="flex flex-col" key={field.id}>
            <Label className="font-bold">{getPlayerNameFromField(field)}</Label>
            <PlayerStatManager
              {...props}
              playerSessionIndex={sessionIndex}
              player={players[sessionIndex]}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlayerSessionManager;
