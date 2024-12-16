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
import { AdminFormProps, FormValues, formSchema } from "../_utils/form-helpers";

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
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={!formIsValid || pending}
      type="submit"
      className="my-2 w-full rounded-md border p-2 sm:w-80"
    >
      Submit
    </Button>
  );
};

export default EntryCreatorForm;
