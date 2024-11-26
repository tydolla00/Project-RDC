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

interface Props {
  control: Control<z.infer<typeof formSchema>>;
}

const SetManager = (props: Props) => {
  const { control } = props;
  const { append, remove, fields } = useFieldArray({
    name: "sets",
    control,
  });

  const { getValues } = useFormContext<z.infer<typeof formSchema>>();

  const players = getValues(`players`);
  return (
    <div className="w-full space-y-4">
      {/* Loop through chapter fields */}
      <div className="font-2xl m-2 text-center font-bold"> Sets </div>

      {fields.map((set, setIndex) => {
        return (
          <div
            className="flex flex-col space-y-3 rounded-lg bg-gray-800 p-6 shadow-lg"
            key={set.setId}
          >
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
                className="bg-red-400 text-xs"
              >
                - Remove Set
              </Button>
            </div>
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
          </div>
        );
      })}

      <Button
        type="button"
        // disabled={!players || players.length === 0} TODO: Add validation
        onClick={() => {
          append({ setId: fields.length + 1, matches: [] });
        }}
        className="rounded-md bg-purple-900 p-2 py-2 text-center font-semibold text-white hover:bg-purple-800"
      >
        + Add Set
      </Button>
    </div>
  );
};

export default SetManager;
