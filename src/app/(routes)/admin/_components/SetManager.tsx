import React from "react";
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

interface Props {
  control: Control<z.infer<typeof formSchema>>;
}

const SetManager = (props: Props) => {
  const { control } = props;
  const { append, remove, fields } = useFieldArray({
    name: "sets",
    control,
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const { getValues } = useFormContext<z.infer<typeof formSchema>>();

  const players = getValues(`players`);
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
                  <div className="text-lg">
                    <h6 className="text-md mb-2"> Set Winner </h6>
                    {set.setWinner.length > 0 ? (
                      <div>
                        {set.setWinner.map((setWinner) => {
                          return setWinner.playerName;
                        })}
                      </div>
                    ) : (
                      <p> No Players found! </p>
                    )}
                  </div>
                  <div className="flex">
                    <TrashIcon
                      className="text-sm text-red-500 hover:cursor-pointer hover:text-red-400"
                      onClick={() => {
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
                    name={`sets.${setIndex}.setWinner`}
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
                  <CollapsibleTrigger>
                    {" "}
                    <ChevronDown />{" "}
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
            append({ setId: fields.length + 1, matches: [], setWinner: [] });
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
