"use client";
import React from "react";
import {
  useForm,
  useFormContext,
  Controller,
  FormProvider,
} from "react-hook-form";
import GameDropDownForm from "./GameDropDownForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PlayerSelector from "./PlayerSelector";
import { Player } from "@prisma/client";
import SetManager from "./SetManager";
import { insertNewSessionFromAdmin } from "@/app/actions/adminAction";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface Props {
  rdcMembers: Player[];
}

// TODO: Move this somewhere else
export const formSchema = z.object({
  game: z.string(),
  sessionName: z.string(),
  sessionUrl: z.string(),
  thumbnail: z.string(),
  players: z.array(
    z.object({
      playerId: z.number(),
      playerName: z.string(),
    }),
  ),
  sets: z.array(
    z.object({
      setId: z.number(),
      setWinner: z.custom(), // TODO: make object
      matches: z.array(
        z.object({
          matchWinner: z.array(
            z.object({
              playerId: z.number(),
              playerName: z.string(),
            }),
          ),
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

  /**
   * Submit method called when EntryCreatorForm submit button clicked
   * @param data entire "Admin" Session object constructed from values
   * in EntryCreator form
   */
  const onSubmit = (data: FormValues) => {
    console.log("---Admin Form Submission Data---: ", data);
    insertNewSessionFromAdmin(data);
  };

  /**
   *
   * @param errors
   */
  const onError = (errors: any) => {
    console.error("Admin Form Submission Errors:", errors);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div
            id="entry-creator-form-info-header"
            className="flex items-center justify-between"
          >
            <FormItem className="text-center">
              <FormLabel>Session Name</FormLabel>
              <Input
                className="my-2 w-80 rounded-md border p-2"
                defaultValue=""
                placeholder="Session Name"
                {...register("sessionName", { required: true })}
              />
            </FormItem>

            <FormItem className="text-center">
              <FormLabel>Session URL</FormLabel>
              <Input
                className="my-2 w-80 rounded-md border p-2"
                defaultValue=""
                placeholder="Session URL"
                {...register("sessionUrl", { required: false })}
              />
            </FormItem>

            <FormItem className="text-center">
              <FormLabel>Thumbnail</FormLabel>

              <Input
                className="my-2 w-80 rounded-md border p-2"
                defaultValue=""
                placeholder="Thumbnail"
                {...register("thumbnail", { required: false })}
              />
            </FormItem>

            <Controller
              name="game"
              control={control}
              render={({ field }) => (
                <GameDropDownForm field={field} control={form.control} />
              )}
            />

            <FormItem className="text-center">
              <FormLabel>Session Players</FormLabel>
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
            </FormItem>
          </div>
          <SetManager control={control} />

          <Button
            type="submit"
            className="my-2 w-80 rounded-md border bg-green-800 p-2"
          >
            Submit
          </Button>
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
