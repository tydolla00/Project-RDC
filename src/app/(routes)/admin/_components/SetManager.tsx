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
import { Card } from "@/components/ui/card";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
              <Card className="flex flex-col space-y-3 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between">
                  <div className="mb-2 text-lg font-semibold">
                    Set {setIndex + 1}
                  </div>{" "}
                  <Button
                    type="button"
                    onClick={() => {
                      // Remove: chapter index
                      remove(setIndex);
                    }}
                    className="bg-red-500 text-sm text-white hover:bg-red-400"
                  >
                    <MinusCircledIcon />
                    Remove Set
                  </Button>
                </div>
                <CollapsibleTrigger>Collapse</CollapsibleTrigger>
                <CollapsibleContent>
                  <label title={"Title"}>
                    <div className="mb-1 flex justify-between">
                      Set Details <div>Game: {getValues("game")}</div>
                    </div>

                    <div className="text-red-400">
                      {/* Error: Chapter title */}
                      {/* {formState.errors.chapters?.[setIndex]?.title?.message} */}
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
              </Card>
            </Collapsible>
          );
        })}

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
  );
};

export default SetManager;
