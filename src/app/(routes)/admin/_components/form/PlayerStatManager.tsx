import React, { useEffect, useState } from "react";
import { Player } from "@prisma/client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/adminContext";
import { FormValues } from "../../_utils/form-helpers";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StatName } from "@/lib/stat-names";

interface Props {
  player: Player;
  matchIndex: number;
  setIndex: number;
  playerSessionIndex: number;
}

// Stats that should be shown in the expandable card for Marvel Rivals
const MARVEL_RIVALS_EXPANDABLE_STATS: StatName[] = [
  StatName.MR_TRIPLE_KILL,
  StatName.MR_QUADRA_KILL,
  StatName.MR_PENTA_KILL,
  StatName.MR_HEXA_KILL,
  StatName.MR_MEDALS,
];

const PlayerStatManager = (props: Props) => {
  const { matchIndex, setIndex, playerSessionIndex } = props;
  const curPlayerSession =
    `sets.${setIndex}.matches.${matchIndex}.playerSessions.${playerSessionIndex}` as const;
  const { register, control, getValues } = useFormContext<FormValues>();
  const { append, fields } = useFieldArray({
    name: `${curPlayerSession}.playerStats`,
    control,
  });

  const { gameStats } = useAdmin();
  const [isExtraStatExpanded, setIsExtraStatExpanded] = useState(false);

  // Get the current game
  const currentGame = getValues("game");
  const isMarvelRivals = currentGame === "Marvel Rivals";

  // TODO: Move to PlayerSessionManager or above
  // TODO: Error message doesn't show up for RL bc refine doesn't pass.

  useEffect(() => {
    let ignore = false;
    const matchFields = getValues(`${curPlayerSession}.playerStats`);
    gameStats.forEach((stat) => {
      const isMatch = matchFields.some((f) => f.stat === stat.statName); // Need to do this in dev because useEffect renders twice.
      if (!ignore && !isMatch)
        // @ts-expect-error Need to exclude unused stats TODO FIX
        append({ statId: uuidv4(), stat: stat.statName, statValue: "" });
    });

    return () => {
      ignore = true;
    };
  }, [gameStats, append, curPlayerSession, getValues]);

  // Separate fields into regular and expandable for Marvel Rivals
  const regularFields = isMarvelRivals
    ? fields.filter(
        (field) =>
          !(MARVEL_RIVALS_EXPANDABLE_STATS as readonly StatName[]).includes(
            field.stat as StatName,
          ),
      )
    : fields;

  const expandableFields = isMarvelRivals
    ? fields.filter((field) =>
        (MARVEL_RIVALS_EXPANDABLE_STATS as readonly StatName[]).includes(
          field.stat as StatName,
        ),
      )
    : [];

  const renderStatField = (field: (typeof fields)[number], index: number) => {
    const curr = `${curPlayerSession}.playerStats.${index}.statValue` as const;
    return (
      <div key={field.id} className="my-4">
        <div className="relative">
          <FormField
            control={control}
            name={curr}
            render={() => (
              <FormItem>
                <Input
                  className="peer block w-[100px] appearance-none rounded-t-lg border-2 px-2.5 pt-6 pb-2.5 text-sm focus:border-b-gray-200 focus:ring-0 focus:outline-none dark:focus:border-purple-700"
                  id={curr}
                  type="text"
                  {...register(curr)}
                />

                <label
                  htmlFor={curr}
                  className="dark:text-white-500 absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform pb-1 text-sm duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-purple-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-purple-700"
                >
                  {field.stat}
                </label>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {regularFields.map((field) => {
        const actualIndex = fields.findIndex((f) => f.id === field.id);
        return renderStatField(field, actualIndex);
      })}

      {isMarvelRivals && expandableFields.length > 0 && (
        <div className="my-4 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExtraStatExpanded(!isExtraStatExpanded)}
            className="flex items-center gap-2"
          >
            {isExtraStatExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
            Multi-Kills & Medals
          </Button>

          {isExtraStatExpanded && (
            <div className="mt-2 flex flex-wrap gap-3 rounded-lg border p-3">
              {expandableFields.map((field) => {
                const actualIndex = fields.findIndex((f) => f.id === field.id);
                return renderStatField(field, actualIndex);
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PlayerStatManager;
