"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Player } from "@prisma/client";
import SetManager from "./SetManager";
import { insertNewSessionFromAdmin } from "@/app/actions/adminAction";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { SessionInfo } from "./SessionInfo";

export interface FormProps {
  rdcMembers: Player[];
}

// TODO: Move this somewhere else
export const formSchema = z.object({
  game: z.string(),
  sessionName: z
    .string()
    .min(4, "Session Name must be at least 4 characters")
    .readonly(),
  sessionUrl: z
    .string()
    .toLowerCase()
    .startsWith(
      "https://www.youtube.com",
      "Please paste in a valid youtube url.",
    )
    .max(100)
    .includes("dummy", { message: "Invalid URL" }),
  date: z.date().readonly(),
  thumbnail: z.string().readonly(),
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
        setWinners: z
          .array(
            z.object({
              playerId: z.number(),
              playerName: z.string(),
            }),
          )
          .min(1, "At least one set winner is required."),
        matches: z.array(
          z.object({
            matchWinners: z
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
// TODO Do we want to conditionally apply input types/validations based on the stat name? Most will be numbers
export type FormValues = z.infer<typeof formSchema>;

const EntryCreatorForm = (props: FormProps) => {
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
    formState: { errors, defaultValues, isValid: formIsValid },
    setValue,
  } = form;

  console.log("Admin Form", watch());
  console.log("Watch: ", watch("sets.0.setWinners.0"));

  /**
   * Submit method called when EntryCreatorForm submit button clicked
   * @param data entire "Admin" Session object constructed from values
   * in EntryCreator form
   */
  const onSubmit = async (data: FormValues) => {
    console.log("---Admin Form Submission Data---: ", data);
    insertNewSessionFromAdmin(data);
    console.log("TOasted");
    toast.success("Session successfully created.", { richColors: true });
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
    toast.error(`Error creating session please check all fields.`, {
      richColors: true,
    });
  };

  //! TODO May need to refactor ID's. Not sure what they were being used for.
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <div className="m-2 text-center text-2xl font-bold dark:text-purple-500">
          {" "}
          Entry Creator Form
        </div>

        <form
          method="post"
          className="grid grid-cols-2 rounded-md border p-4"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <SessionInfo form={form} rdcMembers={rdcMembers} />
          <div className="order-3 col-span-2 md:order-none">
            <SetManager control={control} />
            <Submit formIsValid={formIsValid} />
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

const Submit = ({ formIsValid }: { formIsValid: boolean }) => {
  const status = useFormStatus();

  return (
    <Button
      disabled={!formIsValid || status.pending}
      type="submit"
      className="my-2 w-full rounded-md border p-2 sm:w-80"
    >
      Submit
    </Button>
  );
};

export default EntryCreatorForm;
