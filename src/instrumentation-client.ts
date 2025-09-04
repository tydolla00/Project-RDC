import posthog from "posthog-js";

// The instrumentation-client.ts file allows you to add monitoring and analytics code that runs before your application's frontend code starts executing.

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well

  loaded: () => {
    // if (process.env.NODE_ENV === "development") posthog.debug(); // set false to disable
  },
});
