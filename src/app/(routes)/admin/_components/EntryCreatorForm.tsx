"use client";
import React, { useState } from "react";
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
import { AdminDatePicker } from "./AdminDatePicker";
import { getRDCVideoDetails } from "@/app/actions/action";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
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
    .includes("v=", { message: "Invalid URL" }),
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
                      statId: z.string(), // Note this statId is not the same as the statId used in the schema
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

const EntryCreatorForm = (props: Props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [session, setSession] = useState<
    Awaited<ReturnType<typeof getRDCVideoDetails>> | undefined
  >(undefined);

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
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, defaultValues, isValid: formIsValid },
    setValue,
    getValues,
  } = form;

  const url = watch("sessionUrl");

  console.log("Admin Form", watch());
  // console.log("Watch: ", watch("sets.0.setWinners.0"));
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
          {" "}
          Entry Creator Form
        </div>

        <form
          className="grid grid-cols-2 rounded-md border p-4"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <div className="col-span-2 mb-5 flex flex-wrap content-end justify-items-end gap-2">
            <FormField
              control={form.control}
              name="sessionUrl"
              render={({ field }) => (
                <FormItem>
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
            <Button
              disabled={isFetching}
              style={{ alignSelf: "end" }}
              onClick={handleUrlUpdated}
              type="button"
              variant="default"
            >
              Update URL
            </Button>
          </div>
          <div className="order-2 col-span-2 md:order-none md:col-span-1">
            <div id="entry-creator-form-info-subheader" className="my-5">
              <Controller
                name="game"
                control={control}
                render={({ field }) => (
                  <GameDropDownForm field={field} control={form.control} />
                )}
              />
            </div>

            <FormItem>
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
          <div className="order-1 col-span-2 md:order-none md:col-span-1">
            <div
              id="entry-creator-form-info-header"
              className="flex flex-wrap items-center justify-between gap-y-2"
            >
              <FormField
                // disabled
                control={form.control}
                name="sessionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Session Name</FormLabel>
                    <Input
                      className="my-2 w-80 rounded-md border p-2"
                      placeholder="Session Name"
                      {...field}
                    />
                    {errors.sessionName && (
                      <p className="text-red-500">
                        {errors.sessionName.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
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
              <AdminDatePicker />
            </div>
            <div className="my-2 max-h-72 w-72 max-w-72">
              {session ? (
                <Thumbnail session={session} />
              ) : (
                <Skeleton className="h-32" />
              )}
            </div>
          </div>
          <div className="order-3 col-span-2 md:order-none">
            <SetManager control={control} />
            <Button
              // disabled={!formIsValid}
              type="submit"
              className="my-2 w-80 rounded-md border p-2"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

const Thumbnail = ({
  session,
}: {
  session: NonNullable<Awaited<ReturnType<typeof getRDCVideoDetails>>>;
}) => (
  <Image
    src={
      typeof session.thumbnail === "string"
        ? session.thumbnail
        : session.thumbnail.url
    }
    height={
      typeof session.thumbnail === "string" ? 9 : session.thumbnail.height
    } // 16:9 aspect ratio
    width={typeof session.thumbnail === "string" ? 16 : session.thumbnail.width}
    alt="RDC Youtube Video Thumbnail"
  />
);

export default EntryCreatorForm;
