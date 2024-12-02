import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;
  if (session && path === "/signin")
    return Response.redirect(new URL("/", request.url));
  if ((path === "/admin" || path === "/submission") && !session)
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
