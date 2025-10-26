import config from "@/lib/config";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Ensure only authorized cron jobs can access this route

  const cronSecret = config.CRON_SECRET;
  const authHeader = req.headers.get("authorization") ?? "";

  if (!cronSecret) return new Response("Missing cron secret", { status: 500 });

  if (authHeader !== `Bearer ${cronSecret}`)
    return new Response("Unauthorized", { status: 401 });

  //   TODO Send email using resend.
}
