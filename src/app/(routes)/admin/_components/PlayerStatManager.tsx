import React, { useEffect } from "react";
import { Game, Player } from "@prisma/client";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
import { getGameStats } from "@/app/_actions/adminAction";
import { FormValues } from "./EntryCreatorForm";

interface Props {
  player: Player;
  matchIndex: number;
  setIndex: number;
  playerSessionIndex: number;
}

// Need to get the stats of each game and then display appropriate input field for each stat

const PlayerStatManager = (props: Props) => {
  const { player, matchIndex, setIndex, playerSessionIndex } = props;
  const { register, control, getValues } = useFormContext<FormValues>();
  const { append, remove, fields } = useFieldArray<FormValues>({
    name: `sets.${setIndex}.matches${matchIndex}.playerSessions.${playerSessionIndex}.playerStats`,
    control,
  });

  // TODO: Move to PlayerSessionManager or above
  useEffect(() => {
    const fetchGameStats = async () => {
      const game: string = getValues(`game`);
      const gameStats = await getGameStats(game);
      console.log("Game Stats: ", gameStats);

      gameStats.forEach((stat) => {
        console.log("Appending: ", stat.statName);
        append({ stat: stat.statName });
      });
    };
    fetchGameStats();
  }, []);

  const getPlayerStats = () => {
    const values = getValues();
    return values.sets.flatMap((set) =>
      set.matches.flatMap((match) =>
        match.playerSessions.flatMap((session) => session.playerStats),
      ),
    );
  };

  return (
    <div>
      Player Stats:
      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <span>{field.statName}</span>
            <label>Stat {index + 1}</label>
            <input
              type="text"
              {...register(
                `sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats.${index}.stat`,
              )}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlayerStatManager;
