"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import Form from "next/form";

// https://codesandbox.io/p/sandbox/zealous-tess-jpwm9r?file=%2Fsrc%2FApp.tsx%3A51%2C58-51%2C66
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getRDCVideoDetails, submitUpdates } from "@/app/actions/action";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import { getVideoId } from "../../admin/_utils/helper-functions";
import { formSchema } from "../../admin/_utils/form-helpers";

// ! Deprecated
export const SubmissionForm = () => {
  const [session, setSession] = useState<
    Awaited<ReturnType<typeof getRDCVideoDetails>>["video"] | undefined
  >(undefined);
  const form = useForm<z.infer<typeof formSchema>>({
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
  const { invalid, error, isTouched } = form.getFieldState("sessionUrl");
  const { fields, append } = useFieldArray({
    name: "sets",
    control: form.control,
  });

  const url = form.watch("sessionUrl");

  const submitForm = (data: z.infer<typeof formSchema>) => {
    console.log("Got here");
    submitUpdates(data);
  };
  const saveBtnClicked = async () => {
    if (!isTouched || invalid) {
      toast("Please submit a valid url.");
      return;
    }

    const videoId = getVideoId(url);

    const { error, video } = await getRDCVideoDetails(videoId);
    if (error !== undefined) {
      form.reset(undefined, { keepIsValid: true });
      toast("Please upload a video by RDC Live");
    } else {
      if (isTouched && !invalid) toast("Changes saved");
      setSession(video);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        <Tabs className="w-[500px]" defaultValue="video">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger disabled={isTouched ? invalid : true} value="data">
              Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="video">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Submission Form</CardTitle>
                <CardDescription>
                  Want to help us update scores as they come in? Paste in the
                  youtube video then click the data tab to input your data for
                  the video.
                </CardDescription>
                <Separator />
                <CardContent>
                  {session && (
                    <Image
                      src={
                        typeof session.thumbnail === "string"
                          ? session.thumbnail
                          : session.thumbnail.url
                      }
                      height={
                        typeof session.thumbnail === "string"
                          ? 9
                          : session.thumbnail.height
                      } // 16:9 aspect ratio
                      width={
                        typeof session.thumbnail === "string"
                          ? 16
                          : session.thumbnail.width
                      }
                      alt="RDC Youtube Video Thumbnail"
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="sessionUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Youtube Video</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.youtube.com/..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the video that you are associating with the
                          stats.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                </CardContent>
                <CardFooter>
                  <Button onClick={saveBtnClicked} type="button">
                    Save
                  </Button>
                </CardFooter>
              </CardHeader>
            </Card>
          </TabsContent>
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Video Data</CardTitle>
                <CardDescription>
                  Update the values for each member and category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* {fields.map((f, i) => (
                  <div key={f.id}>
                    <FormField
                      control={form.control}
                      name={``}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stat</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a stat" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="leland">
                                Best in the game
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This is the video that you are associating with the
                            stats.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Members index={i} />
                    <div className="my-5 h-0.5 bg-neutral-800"></div>
                  </div>
                ))} */}
              </CardContent>
              <CardFooter>
                {/* <Button
                  className=""
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    append({ statName: "", member: [] });
                  }}
                >
                  Add Stat
                </Button> */}
                <Button className="ml-auto">Submit</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

const Separator = () => <div className="my-6"></div>;

const Members = ({ index }: { index: number }) => {
  const {
    append,
    remove,
    fields: members,
  } = useFieldArray({
    name: `stat.${index}.member`,
  });

  return (
    <>
      {members.map((member, i) => (
        <>
          <div className="flex gap-5">
            <FormField
              key={member.id}
              // control={form.control}
              name={`stat.${index}.member${i}.name`}
              render={({ field }) => (
                <div className="flex-1">
                  <FormItem>
                    <FormLabel>Member</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an RDC member." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="leland">Leland</SelectItem>
                        <SelectItem value="aff">Aff</SelectItem>
                        <SelectItem value="mark">Mark</SelectItem>
                        <SelectItem value="dylan">Dylan</SelectItem>
                        <SelectItem value="desmond">Desmond</SelectItem>
                        <SelectItem value="john">John</SelectItem>
                        <SelectItem value="ben">Ben</SelectItem>
                        <SelectItem value="ippi">Ippi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              // control={form.control}
              name={`stat.${index}.member.${i}.statVal`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input autoFocus={false} {...field} />
                  </FormControl>
                  <FormDescription>
                    This members associated value.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      ))}
      <Separator />
      <Button
        type="button"
        onClick={() => {
          append({});
        }}
      >
        Add Member
      </Button>
      <Separator />
    </>
  );
};
