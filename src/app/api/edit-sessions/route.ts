import config from "@/lib/config";
import { NextRequest } from "next/server";
import { handlePrismaOperation } from "prisma/db";

export async function GET(req: NextRequest) {
  // Ensure only authorized cron jobs can access this route
  const cronSecret = config.CRON_SECRET;
  const authHeader = req.headers.get("authorization") ?? "";

  if (!cronSecret) return new Response("Missing cron secret", { status: 500 });

  if (authHeader !== `Bearer ${cronSecret}`)
    return new Response("Unauthorized", { status: 401 });

  // Start work
  const res = await handlePrismaOperation((prisma) =>
    prisma.sessionEditRequest.deleteMany({
      where: { status: { in: ["APPROVED", "REJECTED"] } },
    }),
  );
  if (res.success) {
    console.log(`Deleted ${res.data.count} edit sessions`);
  }
  return new Response("Cleaned up edit sessions", { status: 200 });
}
