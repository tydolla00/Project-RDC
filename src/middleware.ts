import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // TODO If /submission and user not logged in redirect to signin
  if (
    (request.nextUrl.pathname === "/admin" ||
      request.nextUrl.pathname === "/submission") &&
    process.env.NODE_ENV !== "development"
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
