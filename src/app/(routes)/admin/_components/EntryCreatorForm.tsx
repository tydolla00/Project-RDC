"use client";
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Player } from "@prisma/client";
import SetManager from "./SetManager";
import { insertNewSessionFromAdmin } from "@/app/actions/adminAction";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formSchema, FormValues } from "../_utils/form-helpers";
import { AdminFormProps } from "../_utils/form-helpers";
import { useAdmin } from "@/lib/adminContext";
import { useFormStatus } from "react-dom";
import { SessionInfo } from "./SessionInfo";

interface Props {
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

  useEffect(() => {
    const fetchData = async () => {
      if (game) {
        await getGameStatsFromDb(game);
      }
    };
    fetchData();
  }, [game, getGameStatsFromDb]);

  const url = watch("sessionUrl");
  console.log("Errors: ", errors);

  /**
   * Submit method called when EntryCreatorForm submit button clicked
   * @param data entire "Admin" Session object constructed from values
   * in EntryCreator form
   */
  const onSubmit = async (data: FormValues) => {
    console.log("Form Data Being Submitted:", {
      data,
      stringified: JSON.stringify(data, null, 2),
    });

    // data.date = new Date(data.date);
    // console.log("Date Type in submit:", typeof data.date);

    insertNewSessionFromAdmin(data);
    console.log("TOasted");
    toast.success("Session successfully created.", { richColors: true });
  };

  // console.log("Date Type:", typeof getValues().date);

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

  const handleUrlUpdated = async () => {
    // TODO Debounce/Rate limit
    const queryParams = url.substring(url.indexOf("v="));
    const extraParams = queryParams.indexOf("&");
    const end = extraParams === -1 ? undefined : extraParams;
    const newUrl = queryParams.substring(2, end);

    // See if url is valid.
    // TODO Invalid not working
    if (
      defaultValues?.sessionUrl === url ||
      control.getFieldState("sessionUrl").invalid ||
      newUrl.length === 0
    ) {
      toast.error("Invalid url", { richColors: true });
      return;
    }

    setIsFetching(true);

    const video = await getRDCVideoDetails(newUrl);
    if (!video) {
      form.reset(undefined, { keepIsValid: true });
      toast.error("Please upload a video by RDC Live", { richColors: true });
    } else {
      setValue("sessionName", video.sessionName, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue(
        "thumbnail",
        typeof video.thumbnail === "string"
          ? video.thumbnail
          : video.thumbnail.url,
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        },
      );
      setValue("date", new Date(video.date), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setSession(video);
      toast.success("Youtube video successfully linked.", { richColors: true });
    }

    console.log(video);
    console.log("Form values after update:", getValues());

    setIsFetching(false);
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
