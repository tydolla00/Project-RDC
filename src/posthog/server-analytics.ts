import posthog from "@/posthog/server-init";
import { auth } from "@/auth";
import { FormValues } from "@/app/(routes)/admin/_utils/form-helpers";
import { ErrorModelOutput } from "@azure-rest/ai-document-intelligence";

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
  posthog.capture({
    event,
    distinctId: email,
  });
};

export const logNAN = (fnName: string, email: string, statId: number) => {
  posthog.capture({
    event: `NaN called in ${fnName} for statId: ${statId}`,
    distinctId: email,
  });
};

export const logFormError = (
  err: unknown,
  email: string,
  session: FormValues,
) => {
  posthog.capture({
    distinctId: email,
    event: "ADMIN_FORM_ERROR",
    properties: {
      error: err,
      session: JSON.stringify(session),
    },
  });
};

export const logFormSuccess = (email: string) => {
  posthog.capture({
    event: "ADMIN_FORM_SUCCESS",
    distinctId: email,
    properties: {
      submittedAt: new Date().toISOString(),
    },
  });
};

export const logVisionError = (
  email: string,
  error: ErrorModelOutput | unknown,
) => {
  posthog.capture({
    event: "VISION_ERROR",
    distinctId: email,
    properties: {
      error,
    },
  });
};
