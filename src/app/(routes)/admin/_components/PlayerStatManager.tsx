import React, { useEffect } from "react";
import { Player } from "@prisma/client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { getGameStats } from "@/app/actions/adminAction";
import { FormValues } from "./EntryCreatorForm";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";

interface Props {
  player: Player;
  matchIndex: number;
  setIndex: number;
  playerSessionIndex: number;
  statName: string;
}

// Need to get the stats of each game and then display appropriate input field for each stat

const PlayerStatManager = (props: Props) => {
  const {
    player,
    matchIndex,
    setIndex,
    playerSessionIndex,
    statName: gameStat,
  } = props;
  const { register, control, getValues } = useFormContext<FormValues>();
  const { append, remove, fields } = useFieldArray({
    name: `sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats`,
    control,
  });

  console.log("Player Session ", playerSessionIndex);

  // TODO: Move to PlayerSessionManager or above
  useEffect(() => {
    console.log(
      "All Player Sessions: ",
      getValues(`sets.${setIndex}.matches.${matchIndex}.playerSessions`),
    );

    const getPlayerSessionStats = () => {
      const values = getValues();
      const playerSession =
        values.sets[setIndex].matches[matchIndex].playerSessions[
          playerSessionIndex
        ];
      return playerSession.playerStats;
    };

    const fetchGameStats = async () => {
      const game: string = getValues(`game`);
      let gameStats: {
        type: string | null;
        statId: number;
        statName: string;
        gameId: number;
      }[] = [];

      if (game) {
        console.log("Fetched Game: ", game);

        gameStats = await getGameStats(game);
        console.log("Found Game Stats: ", gameStats);
      }

      const existingStats = getPlayerSessionStats();
      console.log("PlayerStats", existingStats);

      gameStats.forEach((stat) => {
        const statExists = existingStats.some(
          (existingStat) => existingStat.stat === stat.statName,
        );
        // Ducttape fix to stop useEffect double render from
        // doubling playerStat fields
        if (!statExists) {
          append({ statId: uuidv4(), stat: stat.statName, statValue: "" });
        }
      });
    };
    fetchGameStats();
  }, [append, getValues, matchIndex, playerSessionIndex, setIndex]);

  console.log("Fields: ", fields);

  return (
    <>
      {fields.map((field, index: number) => {
        return (
          <div key={field.id} className="my-4 flex gap-3">
            {/* <span className="self-end">{field.stat}</span> */}
            <Input
              className="h-full max-w-xs"
              placeholder={gameStat}
              type="text"
              {...register(
                `sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats.${index}.statValue`,
              )}
            />
          </div>
        );
      })}
    </>
  );
};

export default PlayerStatManager;
