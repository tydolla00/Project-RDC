import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, UseFormReturn } from "react-hook-form";
import { AdminDatePicker } from "./AdminDatePicker";
import GameDropDownForm from "./GameDropDownForm";
import PlayerSelector from "./PlayerSelector";
import { useState, useTransition } from "react";
import { FormProps, FormValues } from "./EntryCreatorForm";
import { getRDCVideoDetails } from "@/app/actions/action";
import Image from "next/image";
import { toast } from "sonner";
import { getVideoId } from "../_utils/helper-functions";

export const SessionInfo = ({
  form,
  rdcMembers,
}: {
  form: UseFormReturn<FormValues>;
  rdcMembers: FormProps["rdcMembers"];
}) => {
  const [session, setSession] = useState<
    Awaited<ReturnType<typeof getRDCVideoDetails>> | undefined
  >(undefined);
  const [isPending, startTransition] = useTransition();
  const control = form.control;
  const errors = form.formState.errors;
  const defaultValues = form.formState.defaultValues;
  const url = form.watch("sessionUrl");

  const handleUrlUpdated = () => {
    startTransition(async () => {
      // TODO Debounce/Rate limit
      const videoId = getVideoId(url); // Raise github issue, works without being imported.

      // See if url is valid.
      // TODO Invalid not working
      if (
        defaultValues?.sessionUrl === url ||
        control.getFieldState("sessionUrl").invalid ||
        videoId.length === 0
      ) {
        toast.error("Invalid url", { richColors: true });
        return;
      }

      const video = await getRDCVideoDetails(videoId);
      if (!video) {
        form.reset(undefined, { keepIsValid: true });
        toast.error("Please upload a video by RDC Live", { richColors: true });
      } else {
        form.setValue("sessionName", video.sessionName);
        form.setValue(
          "thumbnail",
          typeof video.thumbnail === "string"
            ? video.thumbnail
            : video.thumbnail.url,
        );
        form.setValue("date", video.date);
        setSession(video);
        toast.success("Youtube video successfully linked.", {
          richColors: true,
        });
      }
    });
  };
  return (
    <>
      <div className="col-span-2 mb-5 flex flex-wrap content-end justify-items-end gap-2">
        <FormField
          control={form.control}
          name="sessionUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session URL</FormLabel>
              <Input
                className="my-2 rounded-md border p-2"
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
          disabled={isPending}
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
          className="flex flex-wrap items-center justify-between gap-y-2 lg:-my-20"
        >
          <FormField
            disabled
            control={form.control}
            name="sessionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Session Name</FormLabel>
                <Input
                  className="my-2 w-full rounded-md border p-2"
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
            disabled
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>

                {/** TODO: AUtomatically get this from URL */}
                <Input
                  className="my-2 w-full rounded-md border p-2"
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
        <div className="my-2 max-h-72 w-full max-w-72 sm:w-72 lg:my-24">
          {session ? (
            <Thumbnail session={session} />
          ) : (
            <Skeleton className="h-32" />
          )}
        </div>
      </div>
    </>
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
