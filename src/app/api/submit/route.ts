import { insertNewSessionFromAdmin } from "@/app/actions/adminAction";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = auth(async function POST(request) {
  if (process.env.NODE_ENV === "development" && request.auth) {
    try {
      const body = await request.json();
      const res = await insertNewSessionFromAdmin(body);
      if (res.error) throw new Error(res.error);
      revalidateTag("getAllSessions");
      return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 400 });
    }
  }

  return NextResponse.json({ message: "Need to be on dev" }, { status: 400 });
});
