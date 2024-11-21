"use client";
import React from "react";
import {
  useForm,
  useFormContext,
  Controller,
  FormProvider,
} from "react-hook-form";
import { Form } from "@/components/ui/form";
import GameDropDownForm from "./GameDropDownForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PlayerSelector from "./PlayerSelector";
import { Player } from "@prisma/client";
import SetManager from "./SetManager";

interface Props {
  rdcMembers: Player[];
}

export const formSchema = z.object({
  game: z.string(),
  sessionName: z.string(),
  sessionTitle: z.string(),
  players: z.array(
    z.object({
      playerId: z.number(),
      playerName: z.string(),
      // Add other Player fields as needed
    }),
  ),
  sets: z.array(
    z.object({
      setId: z.number(),
      setWinner: z.custom(),
      matches: z.array(
        z.object({
          matchId: z.number(),
          // Add other Match fields as needed
        }),
      ),
    }),
  ),
});

const EntryCreatorForm = (props: Props) => {
  const { rdcMembers } = props;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { register, handleSubmit, control, watch } = form;

  console.log(watch());

  const onSubmit = (data: any) => console.log(data);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <NestedInput /> */}
          <div className="flex justify-around">
            <input
              className="my-2 w-80 rounded-md border p-2"
              defaultValue=""
              placeholder="Session Title"
              {...register("sessionTitle", { required: true })}
            />
            <Controller
              name="game"
              control={control}
              render={({ field }) => (
                <GameDropDownForm control={form.control} />
              )}
            />
            <Controller
              name="players"
              control={control}
              render={({ field }) => (
                <PlayerSelector
                  rdcMembers={rdcMembers}
                  control={form.control}
                />
              )}
            />
          </div>
          <SetManager control={control} />
          {/* <button
            onClick={() => {
              form.setValue("sets", [
                ...form.getValues("sets"),
                {
                  setId: form.getValues("sets").length + 1,
                  matches: [],
                  setWinner: 0,
                },
              ]);
            }}
          >
            {" "}
            Add Set
          </button> */}

          {/* <GameDropDownForm /> */}
          {/* <Controller name="players" render={({ field }) => <PlayerSelector />} /> */}
          <input
            className="rounded-md border border-white p-2 hover:cursor-pointer"
            type="submit"
          />
          {/* register your input into the hook by invoking the "register" function */}
        </form>
      </Form>
    </FormProvider>
  );
};

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods

  return <input {...register("test")} />;
}

export default EntryCreatorForm;
