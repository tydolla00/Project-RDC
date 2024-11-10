"use server";

import { PrismaClient } from "@prisma/client";
import config from "@/lib/config";

export const submitUpdates = async (props: any) => {
  console.log(props);
};

export const getYTVid = async (videoId: string) => {
  const prisma = new PrismaClient();
  const sessions = await prisma.session.findMany();
  const sessionURL = sessions.find(
    (session) => session.sessionUrl.split("=")[1] === videoId,
  );
  console.log(sessionURL);
  if (!sessionURL) {
    const YTvideo = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=player&id=${videoId}&key=${config.YOUTUBE_LOCAL_API_KEY}`,
    );
    console.log(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=player&id=${videoId}&key=${config.YOUTUBE_LOCAL_API_KEY}`,
    );
    console.log(YTvideo, videoId);
    !config.YOUTUBE_LOCAL_API_KEY &&
      console.log("YOUTUBE API KEY NOT CONFIGURED");

    if (!YTvideo.ok) return undefined;

    const json = (await YTvideo.json()) as YouTubeVideoListResponse;
    console.log(json);
    const video = json.items[0];

    if (video.snippet.channelTitle !== "RDC Live") return undefined;

    const session = {
      sessionUrl: `https://youtube.com/watch?v=${video.id}`,
      date: video.snippet.publishedAt,
      sessionName: video.snippet.title,
      thumbnail:
        video.snippet.thumbnails.maxres || video.snippet.thumbnails.high,
    };
    return session;
  }
  await prisma.$disconnect();

  return undefined;
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
