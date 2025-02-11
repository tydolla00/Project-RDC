import React, { useEffect, useState } from "react";
import {
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
import WinnerDisplay from "./WinnerDisplay";
import { Label } from "@/components/ui/label";
import { formSchema, FormValues } from "../_utils/form-helpers";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { randomInt } from "crypto";

const SetManager = () => {
  const { watch, control } = useFormContext<z.infer<typeof formSchema>>();

  const { append, remove, fields, update } = useFieldArray({
    name: "sets",
    control,
  });

  const [openSets, setOpenSets] = useState<boolean[]>(fields.map(() => false));
  const [textArea, setTextArea] = useState<string[]>(fields.map(() => ""));
  const [highestSetId, setHighestSetId] = useState(0);

  const toggleSet = (index: number) => {
    setOpenSets((prevOpenSets) =>
      prevOpenSets.map((isOpen, i) => (i === index ? !isOpen : isOpen)),
    );
  };

  const handleAddSet = () => {
    const newSetId = highestSetId + 1;
    setHighestSetId(newSetId);
    append({ setId: newSetId, matches: [], setWinners: [] });

    // Then update openSets to match new length with last set open
    setOpenSets((prev) => {
      const newLength = prev.length + 1;
      return Array(newLength)
        .fill(false)
        .map((_, i) => (i === newLength - 1 ? true : (prev[i] ?? false)));
    });

    setTextArea((prev) => {
      const newArr = [...prev];
      newArr.push("");
      return newArr;
    });
  };

  /**
   * Handles the addition of JSON data to a specific set.
   * Parses the JSON data from the text area at the given set index, validates it,
   * and updates the set with the parsed matches and set winners.
   *
   * @param {number} setIndex - The index of the set to which the JSON data will be added.
   * @throws Will throw an error if the JSON data is invalid or not an array.
   */
  const handleAddJSON = (setIndex: number) => {
    try {
      const json = JSON.parse(textArea[setIndex]);
      if (!Array.isArray(json))
        toast.error("Please upload valid json.", { richColors: true });
      else {
        // TODO Set Values
        // TODO Work In Progress. Not completed. Awaiting the status of RDC Vision.
        const matches: FormValues["sets"][0]["matches"] = [];
        const setWinners: FormValues["sets"][0]["setWinners"] = [];
        const setId = randomInt(10000);
        json.forEach((v) => {
          if (!Array.isArray(v)) throw new Error("");
          // Loop through matches.
          v.forEach((val) => {
            matches.push({
              matchWinners: [],
              playerSessions: [
                {
                  playerId: val.playerId,
                  playerSessionName: val.name,
                  playerStats: [],
                },
              ],
            });
          });
          update(setIndex, { matches, setWinners, setId });
        });
      }
      console.log(json);
    } catch (error) {
      console.info(error);
      toast.error("Please upload valid json.", { richColors: true });
    }
  };

  const players = watch(`players`);
  const sets = useWatch({ name: "setWinners" });
  const testSets = useWatch({ control, name: "sets" });
  const game = watch("game");

  useEffect(() => {
    console.log("Set Rerenders: ", sets);
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
                      onClick={() => {
                        setTextArea((prev) => {
                          const newSet = prev.filter(
                            (_, index) => setIndex !== index,
                          );
                          return newSet;
                        });
                        remove(setIndex);
                      }}
                      width={24}
                      height={24}
                    />
                    <span className="sr-only">Delete Set {setIndex}</span>
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  <div
                    style={{ position: "-webkit-sticky" }}
                    className="bg-card sticky top-12 z-10"
                  >
                    <Label className="text-muted-foreground my-2 block">
                      Set Winner
                    </Label>
                  </div>
                  {/* TODO Work In Progress */}
                  <Controller
                    name={`sets.${setIndex}.setWinners`}
                    control={control}
                    render={({ field }) => (
                      <PlayerSelector
                        rdcMembers={players}
                        control={control}
                        field={field}
                        label="Set Winners"
                        sticky={true}
                      />
                    )}
                  />
                  {/* TODO Don't think we will be using this anymore? */}
                  {/* <Label>
                    You may paste in the info of all matches for Set{" "}
                    {setIndex + 1}
                  </Label>
                  <Textarea
                    value={textArea[setIndex]}
                    onChange={(e) =>
                      setTextArea((prev) =>
                        prev.map((prev, i) => {
                          if (i === setIndex) prev = e.target.value;
                          return prev;
                        }),
                      )
                    }
                    className="max-w-xs"
                    placeholder="Paste in json"
                  /> 
                  <Button
                    type="button"
                    onClick={() => handleAddJSON(setIndex)}
                    disabled={textArea[setIndex]?.length <= 0}
                  >
                    Fill Match
                  </Button>
                  */}
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
          disabled={!game}
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
