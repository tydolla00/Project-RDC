"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import config from "./config";

import { useEffect, type JSX } from "react";

export function CSPostHogProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  useEffect(() => {
    posthog.init(config.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: config.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well

      loaded: (posthog) => {
        // if (process.env.NODE_ENV === "development") posthog.debug(); // set false to disable
      },
    });
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
