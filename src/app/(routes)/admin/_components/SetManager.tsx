import React from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./EntryCreatorForm";
import MatchManager from "./MatchManager";

interface Props {
  control: Control<z.infer<typeof formSchema>>;
}

const SetManager = (props: Props) => {
  const { control } = props;
  const { append, remove, fields } = useFieldArray({
    name: "sets",
    control,
  });

  const { register, formState } = useFormContext<z.infer<typeof formSchema>>();
  return (
    <div className="space-y-4">
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
              <button
                type="button"
                onClick={() => {
                  // Remove: chapter index
                  remove(setIndex);
                }}
                className="text-xs text-red-400 underline underline-offset-4"
              >
                Remove Set
              </button>
            </div>

            <label title={"Title"}>
              <div className="mb-1">Set Details</div>
              <div className="text-red-600">
                {/* Error: Chapter title */}
                {/* {formState.errors.chapters?.[setIndex]?.title?.message} */}
              </div>
            </label>
            <MatchManager setIndex={setIndex} />
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          append({ setId: fields.length + 1, matches: [] });
        }}
        className="w-full py-2 text-center text-gray-600 underline underline-offset-4"
      >
        Add Set
      </button>
    </div>
  );
};

export default SetManager;
