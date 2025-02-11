import React, { useEffect } from "react";
import { Player } from "@prisma/client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/adminContext";
import { FormValues } from "../_utils/form-helpers";

interface Props {
  player: Player;
  matchIndex: number;
  setIndex: number;
  playerSessionIndex: number;
}

const PlayerStatManager = (props: Props) => {
  const { player, matchIndex, setIndex, playerSessionIndex } = props;
  const { register, control, getValues } = useFormContext<FormValues>();
  const { append, remove, fields } = useFieldArray({
    name: `sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats`,
    control,
  });

  const { gameStats } = useAdmin();

  // TODO: Move to PlayerSessionManager or above

  useEffect(() => {
    let ignore = false;
    const matchFields = getValues(
      `sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats`,
    );
    gameStats.forEach((stat) => {
      const isMatch = matchFields.some((f) => f.stat === stat.statName); // Need to do this in dev because useEffect renders twice.
      if (!ignore && !isMatch)
        append({ statId: uuidv4(), stat: stat.statName, statValue: "" });
    });

    return () => {
      ignore = true;
    };
  }, [gameStats, append]);

  return (
    <>
      {fields.map((field, index: number) => {
        return (
          <div key={field.id} className="my-4 flex gap-3">
            <span className="sr-only">{field.stat}</span>
            <div className="relative">
              <Input
                className="peer block w-full appearance-none rounded-t-lg border-2 border-gray-500 px-2.5 pt-6 pb-2.5 text-sm text-gray-900 focus:border-b-gray-200 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-purple-700"
                placeholder=""
                id={`sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats.${index}.statValue`}
                type="text"
                {...register(
                  `sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats.${index}.statValue`,
                )}
              />

              <label
                htmlFor={`sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats.${index}.statValue`}
                className="dark:text-white-500 absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform pb-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-purple-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-purple-700"
              >
                {field.stat}
              </label>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PlayerStatManager;
