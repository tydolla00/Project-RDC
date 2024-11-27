import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  if (
    (request.nextUrl.pathname === "/admin" ||
      request.nextUrl.pathname === "/submission") &&
    !session
  )
    return Response.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    "/admin",
    "/submission",
  ],
};

// this will update the session expiry every time its called.
// export { auth as middleware } from "@/auth"
