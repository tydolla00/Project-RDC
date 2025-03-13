import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, UseFormReturn } from "react-hook-form";
import GameDropDownForm from "./GameDropDownForm";
import PlayerSelector from "./PlayerSelector";
import { useState, useTransition } from "react";
import { getRDCVideoDetails } from "@/app/actions/action";
import Image from "next/image";
import { toast } from "sonner";
import { errorCodes } from "@/lib/constants";
import { signOut } from "@/auth";
import { Player } from "@prisma/client";
import { FormValues } from "../../_utils/form-helpers";
import { getVideoId } from "../../_utils/helper-functions";

export const SessionInfo = ({
  form,
  rdcMembers,
}: {
  form: UseFormReturn<FormValues>;
  rdcMembers: Player[];
}) => {
  const [session, setSession] = useState<
    Awaited<ReturnType<typeof getRDCVideoDetails>>["video"] | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const {
    control,
    formState: { errors, defaultValues },
  } = form;
  const url = form.watch("sessionUrl");
  const sessionName = form.watch("sessionName");
  const date = form.watch("date");

  /**
   * Handles the URL update process for a session.
   *
   * This function performs the following steps:
   * 1. Starts a transition to handle the URL update asynchronously.
   * 2. Checks if the provided URL is valid and not the same as the default session URL.
   * 3. If the URL is invalid, displays an error toast message.
   * 4. Fetches video details using the provided URL.
   * 5. If the user is not authenticated, signs out and redirects to the home page.
   * 6. If there is an error fetching video details, resets the form and displays an error toast message.
   * 7. If the video details are successfully fetched, updates the form with the video details and displays a success toast message.
   *
   * @async
   * @function handleUrlUpdated
   * @returns {Promise<void>} A promise that resolves when the URL update process is complete.
   */
  const handleUrlUpdated = () => {
    startTransition(async () => {
      // TODO Debounce/Rate limit
      const videoId = getVideoId(url);
      // See if url is valid.
      if (
        defaultValues?.sessionUrl === url ||
        control.getFieldState("sessionUrl").invalid ||
        videoId.length === 0
      ) {
        toast.error("Invalid url", { richColors: true });
        return;
      }

      const { error, video } = await getRDCVideoDetails(videoId);
      if (error === errorCodes.NotAuthenticated)
        await signOut({ redirectTo: "/" });

      if (error !== undefined) {
        form.reset(undefined, { keepIsValid: true });
        toast.error(error, { richColors: true });
        setSession(null);
      } else {
        const thumbnail =
          typeof video.thumbnail === "string"
            ? video.thumbnail
            : video.thumbnail.url;
        form.setValue("sessionName", video.sessionName);
        form.setValue("thumbnail", thumbnail);
        form.setValue("date", new Date(video.date));
        form.setValue("videoId", videoId);
        setSession(video);
        toast.success("Youtube video successfully linked.", {
          richColors: true,
        });
      }
    });
  };
  return (
    <>
      <div className="gap-2">
        <FormField
          control={control}
          name="sessionUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session URL</FormLabel>
              <Input
                className="my-2 rounded-md border p-2"
                placeholder="Session URL"
                {...field}
              />
              <FormMessage />
              <FormDescription>A valid video is required</FormDescription>
            </FormItem>
          )}
        />
        <Button
          className="my-2"
          disabled={isPending}
          style={{ alignSelf: "end" }}
          onClick={handleUrlUpdated}
          type="button"
          variant="default"
        >
          Update URL
        </Button>
      </div>
      <div id="entry-creator-form-info-subheader" className="my-5">
        <Controller
          name="game"
          control={control}
          render={({ field }) => (
            <GameDropDownForm
              field={field}
              control={form.control}
              reset={form.resetField}
            />
          )}
        />
      </div>
      <FormField
        control={control}
        name="players"
        render={({ field }) => (
          <FormItem>
            <PlayerSelector
              rdcMembers={rdcMembers}
              control={form.control}
              field={field}
              currentSelectedPlayers={field.value}
              label="Session Players"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const Thumbnail = ({
  session,
}: {
  session: Awaited<ReturnType<typeof getRDCVideoDetails>>["video"];
}) => {
  console.log("Session: ", session);
  return (
    <>
      {session ? (
        <Image
          src={
            typeof session.thumbnail === "string"
              ? session.thumbnail
              : session.thumbnail.url
          }
          height={
            typeof session.thumbnail === "string"
              ? 108
              : session.thumbnail.height
          } // 16:9 aspect ratio
          width={
            typeof session.thumbnail === "string"
              ? 192
              : session.thumbnail.width
          }
          alt="RDC Youtube Video Thumbnail"
        />
      ) : (
        <Skeleton className="h-32" />
      )}
    </>
  );
};
