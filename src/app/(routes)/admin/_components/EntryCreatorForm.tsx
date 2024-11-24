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
          matchWinner: z.object({
            playerId: z.number(),
            playerName: z.string(),
          }),
          playerSessions: z.array(
            z.object({
              playerId: z.number(),
              playerSessionName: z.string(),
              playerStats: z.array(
                z.object({
                  statId: z.string(),
                  stat: z.string(),
                  statValue: z.string(),
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  ),
});

// TODO: How to handle type to get the form values more reliably
export type FormValues = z.infer<typeof formSchema>;

const EntryCreatorForm = (props: Props) => {
  const { rdcMembers } = props;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { register, handleSubmit, control, watch } = form;

  console.log("Watch", watch());

  const onSubmit = (data: any) => console.log("Data Submitted", data);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={() => handleSubmit(onSubmit)}>
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
                <GameDropDownForm field={field} control={form.control} />
              )}
            />
            <Controller
              name="players"
              control={control}
              render={({ field }) => (
                <PlayerSelector
                  rdcMembers={rdcMembers}
                  control={form.control}
                  field={field}
                />
              )}
            />
          </div>
          <SetManager control={control} />

          <button
            className="rounded-md border border-white p-2 hover:cursor-pointer"
            onClick={() => handleSubmit(onSubmit)}
          >
            Submit Here!
          </button>
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
