import { insertNewSessionFromAdmin } from "@/app/actions/adminAction";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// TODO Throwing build error
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (process.env.NODE_ENV === "development") {
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

  return NextResponse.json({ message: "Need to be on dev" }, { status: 404 });
}
