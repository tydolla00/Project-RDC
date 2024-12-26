import React, { useEffect, useState } from "react";
import { Player } from "@prisma/client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { getGameStats } from "@/app/actions/adminAction";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmin } from "@/lib/adminContext";
import { StatNames } from "../../../../../prisma/lib/utils";

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

  const [loading, setLoading] = useState(true);
  const { gameStats } = useAdmin();

  // TODO: Move to PlayerSessionManager or above
  useEffect(() => {
    console.log(
      "All Player Sessions: ",
      getValues(`sets.${setIndex}.matches.${matchIndex}.playerSessions`),
    );

    // Returns all the playerStats for the match
    const getPlayerSessionStats = () => {
      const values = getValues();
      console.log(" Get PlayerSessionStats Values: ", values);
      const playerSession =
        values.sets[setIndex].matches[matchIndex].playerSessions[
          playerSessionIndex
        ];
      console.log("PlayerSessionStatGet: ", playerSession.playerStats);
      return playerSession.playerStats;
    };

    const fetchGameStats = async () => {
      const existingStats = getPlayerSessionStats();
      gameStats.forEach((stat) => {
        const statExists = existingStats.some(
          (existingStat) => existingStat.stat === stat.statName,
        );
        // Ducttape fix to stop useEffect double render from
        // doubling playerStat fields
        if (!statExists && stat.statName !== StatNames.RLDay) {
          append({ statId: uuidv4(), stat: stat.statName, statValue: "" });
        }
      });
      setLoading(false);
    };
    fetchGameStats();
  }, [append, getValues, matchIndex, playerSessionIndex, setIndex, gameStats]);

  console.log("PlayerStatManagerFields: ", fields);
  console.log("Loading: ", loading);

  return (
    <>
      {fields.map((field, index: number) => {
        return (
          <div key={field.id} className="my-4 flex gap-3">
            <Input
              className="h-full max-w-xs"
              placeholder={field.stat}
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
