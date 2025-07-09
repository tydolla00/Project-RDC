"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import config from "./config";

import { useEffect, type JSX } from "react";

/**
 * Client-side PostHog provider component for analytics initialization
 *
 * @description
 * This component:
 * 1. Initializes PostHog analytics client on mount
 * 2. Configures PostHog with environment-specific settings
 * 3. Enables person identification tracking
 * 4. Optionally enables debug mode in development
 * 5. Wraps children with PostHog context provider
 *
 * @param children - React child components to wrap with PostHog context
 * @returns JSX element with initialized PostHog provider
 *
 * @example
 * <CSPostHogProvider>
 *   <App />
 * </CSPostHogProvider>
 */
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
