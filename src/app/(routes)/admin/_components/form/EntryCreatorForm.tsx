"use client";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@prisma/client";
import SetManager from "./SetManager";
import {
  insertNewSessionFromAdmin,
  insertNewSessionV2,
} from "@/app/actions/adminAction";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAdmin } from "@/lib/adminContext";
import { useFormStatus } from "react-dom";
import { SessionInfo } from "./SessionInfo";
import { errorCodes } from "@/lib/constants";
import { signOut } from "@/auth";
import { revalidateTag } from "next/cache";
import { formSchema, FormValues } from "../../_utils/form-helpers";

interface AdminFormProps {
  rdcMembers: Player[];
}

const EntryCreatorForm = (props: AdminFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { rdcMembers } = props;
  const form = useForm<FormValues>({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      // console.log("formData", data);
      // console.log(
      //   "validation result",
      //   await zodResolver(formSchema)(data, context, options),
      // );
      return zodResolver(formSchema)(data, context, options);
    },
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

  // console.log(watch());

  // TODO Can we pass this down as a prop, fetch all stats at once.
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
    setIsLoading(true);
    console.log("Form Data Being Submitted:", {
      data,
      stringified: JSON.stringify(data, null, 2),
    });
    console.time("Form Submission Time Start: ");
    const { error: err } = await insertNewSessionFromAdmin(data);
    // const { error: err } = await insertNewSessionV2(data);
    console.timeEnd("Form Submission Time End: ");

    if (err)
      err === errorCodes.NotAuthenticated
        ? await signOut({ redirectTo: "/" })
        : toast.error(err, { richColors: true });
    else {
      toast.success("Session successfully created.", { richColors: true });
      revalidateTag("getAllSessions");
      form.reset();
    }
    setIsLoading(false);
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
          <div className="mb-10 w-fit items-center gap-4">
            <SessionInfo form={form} rdcMembers={rdcMembers} />
          </div>
          {/* <FormSummary /> */}
          <div className="mx-auto">
            <SetManager />
            <Submit formIsValid={formIsValid} loading={isLoading} />
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

const Submit = ({
  formIsValid,
  loading,
}: {
  formIsValid: boolean;
  loading: boolean;
}) => {
  return (
    <Button
      disabled={!formIsValid || loading}
      type="submit"
      className="my-2 w-full rounded-md border p-2"
    >
      Submit
    </Button>
  );
};

export default EntryCreatorForm;
