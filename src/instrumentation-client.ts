import posthog from "posthog-js";
import { initBotId } from "botid/client/core";

// The instrumentation-client.ts file allows you to add monitoring and analytics code that runs before your application's frontend code starts executing.

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well

  loaded: () => {
    // if (process.env.NODE_ENV === "development") posthog.debug(); // set false to disable
  },
});

// Define the paths that need bot protection.
// These are paths that are routed to by your app.
// These can be:
// - API endpoints (e.g., '/api/checkout')
// - Server actions invoked from a page (e.g., '/dashboard')
// - Dynamic routes (e.g., '/api/create/*')

initBotId({
  protect: [
    {
      path: "/feedback",
      method: "POST",
    },
  ],
});
