import posthog from "posthog-js";
import config from "./lib/config";

// The instrumentation-client.ts file allows you to add monitoring and analytics code that runs before your application's frontend code starts executing.

posthog.init(config.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: config.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well

  loaded: (posthog) => {
    // if (process.env.NODE_ENV === "development") posthog.debug(); // set false to disable
  },
});
