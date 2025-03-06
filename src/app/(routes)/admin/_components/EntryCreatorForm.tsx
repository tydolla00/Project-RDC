"use client";
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@prisma/client";
import SetManager from "./SetManager";
import {
  insertNewSessionFromAdmin,
  insertNewSessionV2,
  revalidateAction,
} from "@/app/actions/adminAction";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formSchema, FormValues } from "../_utils/form-helpers";
import { useAdmin } from "@/lib/adminContext";
import { useFormStatus } from "react-dom";
import { SessionInfo } from "./SessionInfo";
import { errorCodes } from "@/lib/constants";
import { signOut } from "@/auth";
import { revalidateTag } from "next/cache";

interface AdminFormProps {
  rdcMembers: Player[];
}

const EntryCreatorForm = (props: AdminFormProps) => {
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
    mode: "onChange",
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, defaultValues, isValid: formIsValid },
    setValue,
    getValues,
  } = form;

  const { gameStats, getGameStatsFromDb } = useAdmin();
  const game = watch("game");

  console.log(watch());

  useEffect(() => {
    const fetchData = async () => {
      if (game) {
        await getGameStatsFromDb(game);
      }
    };
    fetchData();
  }, [game, getGameStatsFromDb]);

  /**
   * Handles the form submission for creating a new session.
   *
   * @param {FormValues} data - The form values to be submitted.
   * @returns {Promise<void>} A promise that resolves when the submission is complete.
   *
   * Logs the form data being submitted and measures the time taken for the submission process.
   * Attempts to insert a new session using the provided form data.
   * If an error occurs during the insertion, handles the error by either signing out the user
   * or displaying an error toast message.
   * If the insertion is successful, displays a success toast message and revalidates the session data.
   */
  const onSubmit = async (data: FormValues) => {
    console.log("Form Data Being Submitted:", {
      data,
      stringified: JSON.stringify(data, null, 2),
    });
    console.time();
    const { error: err } = await insertNewSessionFromAdmin(data);
    // const { error: err } = await insertNewSessionV2(data);
    console.timeEnd();
    console.log(err);

    if (err)
      err === errorCodes.NotAuthenticated
        ? await signOut({ redirectTo: "/" })
        : toast.error(err, { richColors: true });
    else {
      toast.success("Session successfully created.", { richColors: true });
      await revalidateAction("getAllSessions");
      form.reset();
    }
  };

  /**
   * Handles form submission errors by logging them to the console and displaying a toast notification.
   *
   * @param {any} errors - The errors object containing details about the form submission errors.
   * Each key in the object corresponds to a form field, and the value is the error message for that field.
   */
  const onError = (errors: any) => {
    console.log("Admin Form Submission Errors:", errors);
    toast.error(`Error creating session please check all fields.`, {
      richColors: true,
    });
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <div className="m-2 text-center text-2xl font-bold dark:text-purple-500">
          Entry Creator Form
        </div>

        <form
          method="post"
          className="relative mx-auto rounded-md border p-4"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className="mb-10 flex w-fit items-center gap-4">
            <SessionInfo form={form} rdcMembers={rdcMembers} />
          </div>
          <div className="mx-auto">
            <SetManager />
            <Submit formIsValid={formIsValid} />
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

const Submit = ({ formIsValid }: { formIsValid: boolean }) => {
  const { pending } = useFormStatus();
  // TODO add review screen logic before form is truly submitted.
  return (
    <Button
      disabled={!formIsValid || pending}
      type="submit"
      className="my-2 w-full rounded-md border p-2"
    >
      Submit
    </Button>
  );
};

export default EntryCreatorForm;
