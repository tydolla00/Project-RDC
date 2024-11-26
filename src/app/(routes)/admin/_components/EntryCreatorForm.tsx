"use client";
import React from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import GameDropDownForm from "./GameDropDownForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PlayerSelector from "./PlayerSelector";
import { Player } from "@prisma/client";
import SetManager from "./SetManager";
import { insertNewSessionFromAdmin } from "@/app/actions/adminAction";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  rdcMembers: Player[];
}

// TODO: Move this somewhere else
export const formSchema = z.object({
  game: z.string(),
  sessionName: z.string().min(4, "Session Name must be at least 4 characters"),
  sessionUrl: z
    .string()
    .toLowerCase()
    .startsWith(
      "https://www.youtube.com",
      "Please paste in a valid youtube url.",
    )
    .max(100)
    .includes("v="),
  thumbnail: z.string(),
  players: z.array(
    z.object({
      playerId: z.number(),
      playerName: z.string(),
    }),
  ),
  sets: z
    .array(
      z.object({
        setId: z.number(),
        setWinner: z
          .array(
            z.object({
              playerId: z.number(),
              playerName: z.string(),
            }),
          )
          .min(1, "At least one set winner is required."),
        matches: z.array(
          z.object({
            matchWinner: z
              .array(
                z.object({
                  playerId: z.number(),
                  playerName: z.string(),
                }),
              )
              .min(1, "At least one match winner is required."),
            playerSessions: z
              .array(
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
              )
              .min(1, "At least one player session is required"),
          }),
        ),
      }),
    )
    .min(1, "At least one set is required"),
});

// TODO: How to handle type to get the form values more reliably
export type FormValues = z.infer<typeof formSchema>;

const EntryCreatorForm = (props: Props) => {
  const { rdcMembers } = props;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      game: "",
      sessionName: "",
      sessionUrl: "https://www.youtube.com/watch?v=",
      thumbnail: "",
      players: [],
      sets: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  console.log("Watch: ", watch());

  /**
   * Submit method called when EntryCreatorForm submit button clicked
   * @param data entire "Admin" Session object constructed from values
   * in EntryCreator form
   */
  const onSubmit = async (data: FormValues) => {
    console.log("---Admin Form Submission Data---: ", data);
    insertNewSessionFromAdmin(data);
    console.log("TOasted");
    toast("Session successfully created.");
  };

  /**
   * Handles errors that occur during form submission.
   *
   * @param errors - An object containing the errors that occurred during form submission.
   * Each key in the object corresponds to a form field, and the value is the error message for that field.
   *
   */
  const onError = (errors: any) => {
    console.log("Admin Form Submission Errors:", errors);
    toast(`Error creating session please check all fields.`);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div
            id="entry-creator-form-info-header"
            className="flex items-center justify-between"
          >
            <FormField
              control={form.control}
              name="sessionName"
              render={({ field }) => (
                <FormItem className="text-center">
                  <FormLabel>Session Name</FormLabel>
                  <Input
                    className="my-2 w-80 rounded-md border p-2"
                    placeholder="Session Name"
                    {...field}
                  />
                  {errors.sessionName && (
                    <p className="text-red-500">{errors.sessionName.message}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionUrl"
              render={({ field }) => (
                <FormItem className="text-center">
                  <FormLabel>Session URL</FormLabel>
                  <Input
                    className="my-2 w-80 rounded-md border p-2"
                    placeholder="Session URL"
                    {...field}
                  />
                  {errors.sessionUrl && (
                    <p className="text-red-500">{errors.sessionUrl.message}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem className="text-center">
                  <FormLabel>Thumbnail</FormLabel>

                  {/** TODO: AUtomatically get this from URL */}
                  <Input
                    className="my-2 w-80 rounded-md border p-2"
                    placeholder="Thumbnail"
                    {...field}
                  />
                  {errors.thumbnail && (
                    <p className="text-red-500">{errors.thumbnail.message}</p>
                  )}
                </FormItem>
              )}
            />

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

export default EntryCreatorForm;
