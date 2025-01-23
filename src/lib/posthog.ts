import { PostHog } from "posthog-node";
import config from "@/lib/config";
import { Session } from "next-auth";

export default function PostHogClient() {
  const posthogClient = new PostHog(config.NEXT_PUBLIC_POSTHOG_KEY, {
    host: config.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}

/**
 * Identifies a user in PostHog using the provided session information.
 *
 * @param session - The session object containing user information. If the session is null, the function does nothing.
 *
 * @remarks
 * This function initializes a PostHog client, identifies the user with their email (or "Unidentified Email" if the email is not available),
 * and then shuts down the PostHog client.
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
