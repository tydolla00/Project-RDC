import posthog from "@/posthog/server-init";
import { auth } from "@/auth";
import { FormValues } from "@/app/(routes)/admin/_utils/form-helpers";
import { ErrorModelOutput } from "@azure-rest/ai-document-intelligence";
import { Session } from "next-auth";
import { v4 } from "uuid";
import type { MvpOutput } from "@/app/ai/types";

/**
 * Logs an authentication error to PostHog
 * @param error - The error to log
 */
export const logAuthError = async (
  error: Error,
  userSession?: Session | null,
) => {
  try {
    const session = userSession ?? (await auth());
    posthog.captureException({
      event: `Authentication Error - ${error}`,
      distinctId: session?.user?.email ?? "Unidentified Email",
    });
  } catch (error) {
    posthog.captureException({
      event: `Authentication Error - ${error}`,
      distinctId: undefined,
    });
    console.error("Error logging authentication error:", error);
  }
};

/**
 * Logs an authentication event to PostHog
 * @param event - The name of the event to log
 * @param email - The user's email address
 */
export const logAuthEvent = async (
  event: "signin" | "signout",
  userSession?: Session | null,
) => {
  const session = userSession ?? (await auth());
  posthog.capture({
    event,
    distinctId: session?.user?.email || v4(),
  });
};

export const logNAN = async (
  fnName: string,
  statId: number,
  userSession?: Session | null,
) => {
  const session = userSession ?? (await auth());
  posthog.capture({
    event: `NaN called in ${fnName} for statId: ${statId}`,
    distinctId: session?.user?.email || v4(),
  });
};

export const logFormError = async (
  err: unknown,
  session: FormValues,
  userSession?: Session | null,
) => {
  const authSession = userSession ?? (await auth());
  posthog.captureException({
    distinctId: authSession?.user?.email || v4(),
    event: "ADMIN_FORM_ERROR",
    properties: {
      error: err,
      session: JSON.stringify(session),
    },
  });
};

export const logFormSuccess = async (userSession?: Session | null) => {
  const session = userSession ?? (await auth());
  posthog.capture({
    event: "ADMIN_FORM_SUCCESS",
    distinctId: session?.user?.email || v4(),
    properties: {
      submittedAt: new Date().toISOString(),
    },
  });
};

export const logVisionError = async (
  error: ErrorModelOutput | unknown,
  userSession?: Session | null,
) => {
  const session = userSession ?? (await auth());
  posthog.captureException({
    event: "VISION_ERROR",
    distinctId: session?.user?.email || v4(),
    properties: {
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : String(error),
    },
  });
};

export const logMvpUpdateFailure = async (
  sessionId: number,
  error: unknown,
  userSession?: Session | null,
) => {
  const session = userSession ?? (await auth());
  posthog.captureException({
    event: "MVP_UPDATE_FAILURE",
    distinctId: session?.user?.email || v4(),
    properties: {
      sessionId,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : String(error),
    },
  });
};

export const logMvpUpdateSuccess = async (
  sessionId: number,
  mvp: MvpOutput,
  timeStamp: Date,
  duration: number,
  userSession?: Session | null,
) => {
  const session = userSession ?? (await auth());

  posthog.capture({
    event: "MVP_UPDATE_SUCCESS",
    distinctId: session?.user?.email || v4(),
    properties: {
      sessionId,
      mvp,
      timeStamp,
      fnDuration: duration,
    },
  });
};
