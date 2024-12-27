"use server";

import prisma from "../../../prisma/db";
import config from "@/lib/config";
import { Session } from "next-auth";
import { signOut, signIn } from "@/auth";
import { isProduction } from "@/lib/utils";

export const submitUpdates = async (props: any) => {
  console.log(props);
};

export const updateAuthStatus = async (session: Session | null) => {
  session ? await signOut({ redirectTo: "/" }) : await signIn("github");
};

type FindManySessions = Awaited<
  ReturnType<typeof prisma.videoSession.findMany>
>[0];

export const getRDCVideoDetails = async (
  videoId: string,
): Promise<
  | FindManySessions
  | (Pick<FindManySessions, "date" | "sessionName" | "sessionUrl"> & {
      thumbnail: Thumbnail;
    })
  | undefined
> => {
  const sessions = await prisma.videoSession.findMany();

  const session = sessions.find((session) => session.sessionUrl === videoId);
  const apiKey = isProduction
    ? config.YOUTUBE_API_KEY
    : config.YOUTUBE_LOCAL_API_KEY;

  console.log(session);
  if (!session) {
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=player&id=${videoId}&key=${apiKey}`;
    const YTvideo = await fetch(apiUrl);

    !isProduction &&
      !config.YOUTUBE_LOCAL_API_KEY &&
      console.log("LOCAL YOUTUBE API KEY NOT CONFIGURED");

    if (!YTvideo.ok) return undefined;

    const json = (await YTvideo.json()) as YouTubeVideoListResponse;
    const video = json.items[0];

    if (video?.snippet.channelTitle !== "RDC Live") return undefined;

    const session = {
      sessionUrl: `https://youtube.com/watch?v=${video.id}`,
      date: video.snippet.publishedAt,
      sessionName: video.snippet.title,
      thumbnail:
        video.snippet.thumbnails.maxres || video.snippet.thumbnails.high,
    } as unknown as Awaited<ReturnType<typeof getRDCVideoDetails>>;
    return session;
  } else return session;
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
