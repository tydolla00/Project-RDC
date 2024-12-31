import { unstable_cache } from "next/cache";
import prisma from "../db";

export const getAllSessions = unstable_cache(
  async () =>
    await prisma.videoSession.findMany({
      include: { Game: { select: { gameName: true } } },
    }),
  undefined,
  { revalidate: 604800, tags: ["getAllSessions"] }, // 1 week
);
