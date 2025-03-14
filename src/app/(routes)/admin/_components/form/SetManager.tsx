import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import MatchManager from "./MatchManager";
import PlayerSelector from "./PlayerSelector";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { formSchema, Matches, SetWinners } from "../../_utils/form-helpers";
import WinnerDisplay from "./WinnerDisplay";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";

const SetManager = () => {
  const { watch, control } = useFormContext<z.infer<typeof formSchema>>();

  const { append, remove, fields, update } = useFieldArray({
    name: "sets",
    control,
  });

  const [openSets, setOpenSets] = useState<boolean[]>(fields.map(() => false));
  const [highestSetId, setHighestSetId] = useState(fields.length);

  const toggleSet = (index: number) => {
    setOpenSets((prevOpenSets) =>
      prevOpenSets.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  };

  const handleAddSet = () => {
    const newSetId = highestSetId + 1;
    setHighestSetId(newSetId);
    append({
      setId: newSetId,
      matches: [] as unknown as Matches,
      setWinners: [] as unknown as SetWinners,
    });

    // Then update openSets to match new length with last set open
    setOpenSets((prev) => {
      const newLength = prev.length + 1;
      return Array(newLength)
        .fill(false)
        .map((_, i) => (i === newLength - 1 ? true : (prev[i] ?? false)));
    });
  };

  const players = watch(`players`);
  const sets = useWatch({ name: "setWinners" });
  const testSets = useWatch({ control, name: "sets" });
  const game = watch("game");

  useEffect(() => {
    console.log("Set Rerenders: ", sets, fields);
  }, [fields, sets, testSets]);

  return (
    <div className="col-span-2 w-full space-y-4">
      {/* Loop through set fields */}
      <div className="font-2xl m-2 text-center font-bold"> Sets </div>
      {(fields.length === 0 && (
        <div className="text-muted-foreground text-center">
          No Sets! Click Add Set to start!
        </div>
      )) ||
        fields.map((set, setIndex) => {
          return (
            <Collapsible open={openSets[setIndex]} key={set.setId}>
              <Card className="flex flex-col space-y-3 rounded-lg p-6 shadow-lg">
                <CardHeader className="flex flex-row justify-between space-y-0 pr-0 pb-0 pl-0">
                  <div className="mb-2 text-lg font-semibold">
                    Set {setIndex + 1}
                  </div>{" "}
                  <WinnerDisplay setIndex={setIndex} />
                  <div className="flex" title={`Delete Set ${setIndex + 1}`}>
                    <TrashIcon
                      className="text-sm text-red-500 hover:cursor-pointer hover:text-red-400"
                      onClick={() => remove(setIndex)}
                      width={24}
                      height={24}
                    />
                    <span className="sr-only">Delete Set {setIndex}</span>
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  <FormField
                    name={`sets.${setIndex}.setWinners`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <PlayerSelector
                          currentSelectedPlayers={field.value}
                          rdcMembers={players}
                          control={control}
                          field={field}
                          label="Set Winners"
                          sticky={true}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <MatchManager setIndex={setIndex} />
                </CollapsibleContent>
                <CardFooter className="flex flex-row-reverse pb-0">
                  <CollapsibleTrigger onClick={() => toggleSet(setIndex)}>
                    {" "}
                    <ChevronDown
                      className={`transition-transform duration-300 ${
                        openSets[setIndex] ? "rotate-180" : ""
                      }`}
                    />{" "}
                  </CollapsibleTrigger>
                </CardFooter>
              </Card>
            </Collapsible>
          );
        })}
      <div className="ml-auto w-fit">
        <Button
          disabled={!game || players.length === 0}
          type="button"
          onClick={() => handleAddSet()}
          className="rounded-md bg-purple-900 p-2 py-2 text-center font-semibold text-white hover:bg-purple-800"
        >
          Add Set
        </Button>
      </div>
    </div>
  );
};

export default SetManager;
