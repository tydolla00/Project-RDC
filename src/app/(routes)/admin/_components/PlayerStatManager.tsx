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

// Need to get the stats of each game and then display appropriate input field for each stat

const PlayerStatManager = (props: Props) => {
  const { player, matchIndex, setIndex, playerSessionIndex } = props;
  const { register, control, getValues } = useFormContext<FormValues>();
  const { append, remove, fields } = useFieldArray({
    name: `sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}.playerStats`,
    control,
  });

  // const [loading, setLoading] = useState(true);
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

  // TODO Fix bug, when changing the games doesn't remove stale inputs
  return (
    <>
      {fields.map((field, index: number) => {
        return (
          <div key={field.id} className="my-4 flex gap-3">
            <span className="sr-only">{field.stat}</span>
            <Input
              className="max-w-xs"
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
