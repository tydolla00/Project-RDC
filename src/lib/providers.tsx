"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import config from "./config";

import type { JSX } from "react";

if (typeof window !== "undefined") {
  posthog.init(config.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: config.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}

export function CSPostHogProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
