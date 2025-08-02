import posthog from "./posthog";
import { auth } from "@/auth";

/**
 * Logs an authentication error to PostHog
 * @param error - The error to log
 */
export const logAuthError = async (error: Error) => {
  const session = await auth();
  posthog.capture({
    event: `Authentication Error - ${error}`,
    distinctId: session?.user?.email ?? "Unidentified Email",
  });
};

/**
 * Logs an authentication event to PostHog
 * @param event - The name of the event to log
 * @param email - The user's email address
 */
export const logAuthEvent = (event: "signin" | "signout", email: string) => {
  if (event === "signin") posthog.identify({ distinctId: email });
  posthog.capture({
    event,
    distinctId: email,
  });
};