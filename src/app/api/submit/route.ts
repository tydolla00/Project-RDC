import { insertNewSessionFromAdmin } from "@/app/actions/adminAction";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request to submit a new session.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response object.
 *
 * The function performs the following steps:
 * 1. Authenticates the user session.
 * 2. If the session is not authenticated, returns a 401 Unauthorized response.
 * 3. If the environment is development:
 *    - Parses the request body.
 *    - Attempts to insert a new session from the admin.
 *    - If successful, revalidates the "getAllSessions" tag and returns a 200 Success response.
 *    - If an error occurs, returns a 400 Bad Request response with the error message.
 * 4. If the environment is not development, returns a 404 response indicating the need to be in development mode.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
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

  return NextResponse.json(
    { message: "This endpoint is only available in development mode" },
    { status: 404 },
  );
}
