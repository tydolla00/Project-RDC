import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./EntryCreatorForm";
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

  useEffect(() => {
    const watchSetWinnersString = () => {
      const sets = watch("sets");
      return sets
        .map((set, index) => {
          const winners = set.setWinners
            .map((winner) => winner.playerName)
            .join(", ");
          return `Set ${index + 1}: ${winners}`;
        })
        .join(" | ");
    };
    const setWinnersString = watchSetWinnersString();
    console.log(setWinnersString);
  }, [watch]);

  return (
    <div className="w-full space-y-4">
      {/* Loop through chapter fields */}
      <div className="font-2xl m-2 text-center font-bold"> Sets </div>
      {(fields.length === 0 && (
        <div className="text-center text-gray-500">
          No Sets! Click Add Set to start!
        </div>
      )) ||
        fields.map((set, setIndex) => {
          return (
            <Collapsible key={set.setId}>
              <Card className="flex flex-col space-y-3 rounded-lg p-6 pt-1 shadow-lg">
                <CardHeader className="flex flex-row justify-between pb-0 pr-0">
                  <div className="mb-2 text-lg font-semibold">
                    Set {setIndex + 1}
                  </div>{" "}
                  <div
                    id={`set.${setIndex}-set-winner-container`}
                    className="text-center"
                  >
                    <h6 className="mb-2 text-base"> Set Winner </h6>

                    {set.setWinners.length > 0 ? (
                      <div>
                        {watch(`sets`)?.[setIndex]?.setWinners?.map(
                          (player) => {
                            return (
                              <div key={player.playerId}>
                                {player.playerName}
                              </div>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-red-400">
                        {" "}
                        No set winners selected{" "}
                      </p>
                    )}
                  </div>
                  <div className="flex">
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
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  <label title={"Title"}>
                    <div className="mb-1 flex justify-between">
                      Set Details <p>Game: {getValues("game")}</p>
                    </div>
                  </label>
                  <MatchManager setIndex={setIndex} />
                  <div className="text-center text-lg font-semibold">
                    Set Winner for Set {setIndex + 1}
                  </div>
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
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={() => {
            append({ setId: fields.length + 1, matches: [], setWinners: [] });
            setOpenSets([...openSets, false]);
          }}
          className="rounded-md bg-purple-900 p-2 py-2 text-center font-semibold text-white hover:bg-purple-800"
        >
          + Add Set
        </Button>
      </div>
    </div>
  );
};

export default SetManager;
