import { PostHog } from "posthog-node";
import config from "@/lib/config";
import { Session } from "next-auth";

/**
 * Creates and configures a new PostHog client instance
 *
 * @description
 * This factory function:
 * 1. Creates a new PostHog client with environment configuration
 * 2. Sets up immediate event flushing for real-time analytics
 * 3. Configures the host URL from environment settings
 * 4. Disables automatic flush intervals for better control
 * 5. Returns a properly configured singleton instance
 *
 * Configuration includes:
 * - API key from environment config
 * - Host from environment config
 * - Immediate flushing (flushAt: 1)
 * - Disabled flush intervals (flushInterval: 0)
 *
 * @returns Configured PostHog client instance
 */
export default function PostHogClient() {
  const posthogClient = new PostHog(config.NEXT_PUBLIC_POSTHOG_KEY, {
    host: config.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}

/**
 * Identifies a user in PostHog analytics using their session data
 *
 * @description
 * This function:
 * 1. Creates or updates a PostHog user profile from session data
 * 2. Uses email as the distinct ID for consistent user tracking
 * 3. Handles missing email cases with a fallback identifier
 * 4. Properly cleans up PostHog client after identification
 * 5. Safely handles null sessions by doing nothing
 *
 * @param session - The user's session object, or null if not authenticated
 *
 * @example
 * // After user signs in
 * identifyUser(session);
 *
 * // When user signs out
 * identifyUser(null);
 */
export const identifyUser = (session: Session | null) => {
  if (session) {
    console.log("Session", session.user?.email);
    const posthog = PostHogClient();
    posthog.identify({
      distinctId: session.user?.email ?? "Unidentified Email",
    });
    posthog.shutdown();
  }
};
