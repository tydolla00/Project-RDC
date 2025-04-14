"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@prisma/client";
import SetManager from "./SetManager";
import {
  insertNewSessionFromAdmin,
  insertNewSessionV2,
} from "@/app/actions/adminAction";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { SessionInfo } from "./SessionInfo";
import { errorCodes } from "@/lib/constants";
import { signOut } from "@/auth";
import { FormValues, getSchema } from "../../_utils/form-helpers";
import {
  AnimatedFormWrapper,
  NavigationButtons,
} from "@/components/AnimatedFormWrapper";
import { motion } from "motion/react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoInfo } from "./VideoInfo";
import { cn } from "@/lib/utils";
import { FormSummary } from "./Summary";

interface AdminFormProps {
  rdcMembers: Player[];
}

const EntryCreatorForm = ({ rdcMembers }: AdminFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [modifier, setModifier] = useState(0);

  const form = useForm<FormValues, any>({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      const schema = getSchema(data.game);
      console.log("formData", { data, context, options });
      console.log(
        "validation result",
        await zodResolver(schema)(data, context, options),
      );
      return zodResolver(schema)(data, context, options);
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

  const { handleSubmit } = form;

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
  const onSubmit = async (data: FormValues): Promise<void> => {
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
      <div className="grid w-full grid-cols-2 place-content-center gap-3">
        <Card
          className={cn("relative col-span-1 p-4", step === 1 && "col-span-2")}
        >
          <CardHeader className="dark:text-purple-500">
            <CardTitle>Entry Creator Form</CardTitle>
          </CardHeader>
          <AnimatedFormWrapper>
            <Form {...form}>
              <form method="post" onSubmit={handleSubmit(onSubmit, onError)}>
                <motion.div
                  key={step} // Necessary in order for animate presence to know when to rerender
                  className="space-y-4"
                  initial={{ x: `${-110 * modifier}%`, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: `${110 * modifier}%`, opacity: 0 }}
                >
                  {step === 0 && (
                    <SessionInfo form={form} rdcMembers={rdcMembers} />
                  )}
                  {step === 1 && <SetManager />}
                  {step === 2 && <FormSummary />}
                </motion.div>
                <NavigationButtons
                  form={form}
                  isPending={isLoading}
                  step={step}
                  setStep={setStep}
                  setModifier={setModifier}
                />
              </form>
            </Form>
          </AnimatedFormWrapper>
        </Card>
        {step === 0 && <VideoInfo form={form} step={step} />}
      </div>
    </FormProvider>
  );
};

export default EntryCreatorForm;
