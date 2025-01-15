"use server";

import prisma from "../../../prisma/db";
import config from "@/lib/config";
import { Session } from "next-auth";
import { signOut, signIn, auth } from "@/auth";
import { isProduction } from "@/lib/utils";
import { errorCodes } from "@/lib/constants";
import { identifyUser } from "@/lib/posthog";

/**
 * @deprecated
 * @param props
 */
export const submitUpdates = async (props: any) => {
  console.log(props);
};

/**
 * Updates the authentication status based on the provided session.
 * If a session is provided, it signs out the user and redirects to the home page.
 * If no session is provided, it initiates the sign-in process using GitHub.
 *
 * @param {Session | null} session - The current session object or null if no session exists.
 * @returns {Promise<void>} A promise that resolves when the authentication status is updated.
 */
export const updateAuthStatus = async (session: Session | null) => {
  if (session) {
    await signOut({ redirectTo: "/" });
  } else {
    await signIn("github");
    const session = await auth();
    identifyUser(session);
  }
};

/**
 * Fetches RDC video details based on the provided video ID.
 *
 * @param videoId - The ID of the video to fetch details for.
 * @returns An object containing the video details or an error message.
 *
 * The function first checks if the user is authenticated. If not, it returns an error.
 * It then attempts to find the video session in the database using the provided video ID.
 * If the video session is not found in the database, it fetches the video details from the YouTube API.
 * The function ensures that the video is uploaded by "RDC Live" and returns the video details.
 * If the video session is found in the database, it returns the database record.
 *
 * @example
 * ```typescript
 * const videoDetails = await getRDCVideoDetails("someVideoId");
 * if (videoDetails.error) {
 *   console.error(videoDetails.error);
 * } else {
 *   console.log(videoDetails.video);
 * }
 * ```
 */
export const getRDCVideoDetails = async (
  videoId: string,
): GetRdcVideoDetails => {
  const isAuthenticated = await auth();
  if (!isAuthenticated)
    return { video: null, error: errorCodes.NotAuthenticated };

  // TODO add a column for videoId or store videoId as the primary key?
  const dbRecord = await prisma.session.findFirst({
    where: { sessionUrl: videoId }, //! Does not work.
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

type FindManySessions = Awaited<ReturnType<typeof prisma.session.findMany>>[0];

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
