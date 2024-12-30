"use server";

import prisma from "../../../prisma/db";
import config from "@/lib/config";
import { Session } from "next-auth";
import { signOut, signIn, auth } from "@/auth";
import { isProduction } from "@/lib/utils";
import { errorCodes } from "@/lib/constants";

/**
 * @deprecated
 * @param props
 */
export const submitUpdates = async (props: any) => {
  console.log(props);
};

export const updateAuthStatus = async (session: Session | null) => {
  session ? await signOut({ redirectTo: "/" }) : await signIn("github");
};

type FindManySessions = Awaited<
  ReturnType<typeof prisma.videoSession.findMany>
>[0];

type YTAPIRequestSession = Pick<
  FindManySessions,
  "date" | "sessionName" | "sessionUrl"
> & {
  thumbnail: Thumbnail;
};

type GetRdcVideoDetails = Promise<
  | {
      video: FindManySessions | YTAPIRequestSession;
      error: undefined;
    }
  | {
      video: null;
      error: string;
    }
>;

export const getRDCVideoDetails = async (
  videoId: string,
): GetRdcVideoDetails => {
  const isAuthenticated = await auth();
  if (!isAuthenticated)
    return { video: null, error: errorCodes.NotAuthenticated };

  const dbRecord = await prisma.videoSession.findFirst({
    where: { sessionUrl: videoId },
  });
  const apiKey = isProduction
    ? config.YOUTUBE_API_KEY
    : config.YOUTUBE_LOCAL_API_KEY;

  if (!dbRecord) {
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=player&id=${videoId}&key=${apiKey}`;
    const YTvideo = await fetch(apiUrl);

    !isProduction &&
      !config.YOUTUBE_LOCAL_API_KEY &&
      console.log("LOCAL YOUTUBE API KEY NOT CONFIGURED");

    if (!YTvideo.ok)
      return { error: "Something went wrong. Please try again.", video: null };

    const json = (await YTvideo.json()) as YouTubeVideoListResponse;
    const video = json.items[0];

    if (video?.snippet.channelTitle !== "RDC Live")
      return { error: "Please upload a video by RDC Live", video: null };

    const session: YTAPIRequestSession = {
      sessionUrl: `https://youtube.com/watch?v=${video.id}`,
      date: new Date(video.snippet.publishedAt),
      sessionName: video.snippet.title,
      thumbnail:
        video.snippet.thumbnails.maxres || video.snippet.thumbnails.high,
    };
    return { video: session, error: undefined };
  } else return { video: dbRecord, error: undefined };
};

type YouTubeVideoListResponse = {
  kind: "youtube#videoListResponse";
  etag: string;
  items: {
    kind: "youtube#video";
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: Thumbnail;
        medium: Thumbnail;
        high: Thumbnail;
        standard?: Thumbnail;
        maxres?: Thumbnail;
      };
      channelTitle: string;
      tags?: string[];
      categoryId: string;
      liveBroadcastContent: string;
      localized: {
        title: string;
        description: string;
      };
      defaultAudioLanguage?: string;
    };
    player: {
      embedHtml: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};
