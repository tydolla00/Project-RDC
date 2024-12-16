import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
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
import { join } from "path";
import WinnerDisplay from "./WinnerDisplay";
import { Label } from "@/components/ui/label";
import { formSchema } from "../_utils/form-helpers";

interface Props {
  control: Control<z.infer<typeof formSchema>>;
}

const SetManager = (props: Props) => {
  const { watch, formState, control } =
    useFormContext<z.infer<typeof formSchema>>();

  const { append, remove, fields } = useFieldArray({
    name: "sets",
    control,
  });

  const [openSets, setOpenSets] = useState<boolean[]>(fields.map(() => false));
  console.log("open sets", openSets);
  const toggleSet = (index: number) => {
    console.log("toggling set", index);

    setOpenSets((prevOpenSets) =>
      prevOpenSets.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  };

  const { getValues } = useFormContext<z.infer<typeof formSchema>>();

  const players = watch(`players`);
  const sets = useWatch({ name: "setWinners" });
  const testSets = useWatch({ control, name: "sets" });

  useEffect(() => {
    console.log("Set Rerenders: ", sets);
  }, [fields, sets, testSets]);

  return (
    <div className="col-span-2 w-full space-y-4">
      {/* Loop through chapter fields */}
      <div className="font-2xl m-2 text-center font-bold"> Sets </div>
      {(fields.length === 0 && (
        <div className="text-center text-muted-foreground">
          No Sets! Click Add Set to start!
        </div>
      )) ||
        fields.map((set, setIndex) => {
          return (
            <Collapsible key={set.setId}>
              <Card className="flex flex-col space-y-3 rounded-lg p-6 shadow-lg">
                <CardHeader className="flex flex-row justify-between space-y-0 pb-0 pl-0 pr-0">
                  <div className="mb-2 text-lg font-semibold">
                    Set {setIndex + 1}
                  </div>{" "}
                  <WinnerDisplay setIndex={setIndex} />
                  <div className="flex" title={`Delete Set ${setIndex + 1}`}>
                    <TrashIcon
                      className="text-sm text-red-500 hover:cursor-pointer hover:text-red-400"
                      onClick={() => {
                        // Collapse set before removing
                        setOpenSets((prevOpenSets) =>
                          prevOpenSets.map((isOpen, i) =>
                            i === setIndex ? false : isOpen,
                          ),
                        );
                        remove(setIndex);
                      }}
                      width={24}
                      height={24}
                    />
                    <span className="sr-only">Delete Set {setIndex}</span>
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  {/* TODO Is this title needed? */}
                  {/* <label title="Title">
                    <div className="mb-1 flex justify-between text-sm">
                      Set Details <p>Game: {getValues("game")}</p>
                    </div>
                  </label> */}
                  <Label className="my-2 block text-muted-foreground">
                    Set Winner
                  </Label>
                  <Controller
                    name={`sets.${setIndex}.setWinners`}
                    control={control}
                    render={({ field }) => (
                      <PlayerSelector
                        rdcMembers={players}
                        control={control}
                        field={field}
                      />
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
          type="button"
          onClick={() => {
            append({ setId: fields.length + 1, matches: [], setWinners: [] });
            setOpenSets([...openSets, false]);
          }}
          className="rounded-md bg-purple-900 p-2 py-2 text-center font-semibold text-white hover:bg-purple-800"
        >
          Add Set
        </Button>
      </div>
    </div>
  );
};

export default SetManager;
