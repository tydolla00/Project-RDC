/**
 * Handles errors that occur during Next.js requests.
 *
 * @description
 * Logs details about errors that occur during request processing, including:
 * - Error digest and message
 * - Request path and method
 * - Router context (Pages vs App router)
 * - Route information and rendering context
 * - Revalidation status
 *
 * @param error - The error object containing digest and error details
 * @param request - Request context including path, method and headers
 * @param context - Next.js runtime context including router and rendering information
 */
export function onRequestError(
  error: { digest: string } & Error,
  request: {
    path: string; // resource path, e.g. /blog?name=foo
    method: string; // request method. e.g. GET, POST, etc
    headers: { [key: string]: string };
  },
  context: {
    routerKind: "Pages Router" | "App Router"; // the router type
    routePath: string; // the route file path, e.g. /app/blog/[dynamic]
    routeType: "render" | "route" | "action" | "middleware"; // the context in which the error occurred
    renderSource:
      | "react-server-components"
      | "react-server-components-payload"
      | "server-rendering";
    revalidateReason: "on-demand" | "stale" | undefined; // undefined is a normal request without revalidation
    renderType: "dynamic" | "dynamic-resume"; // 'dynamic-resume' for PPR
  },
): void | Promise<void> {
  console.log(
    "ERROR OCCURRED",
    error.message,
    request.method,
    context.routePath,
    context.routeType,
  );
}
