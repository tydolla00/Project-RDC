import posthog from "@/posthog/server-init";
import { auth } from "@/auth";
import { FormValues } from "@/app/(routes)/admin/_utils/form-helpers";
import { ErrorModelOutput } from "@azure-rest/ai-document-intelligence";
import { Session } from "next-auth";
import { v4 } from "uuid";
import type { MvpOutput } from "@/app/ai/types";
import { after } from "next/server";

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
    posthog.captureException(
      `Authentication Error - ${error}`,
      session?.user?.email ?? "Unidentified Email",
    );
  } catch (error) {
    posthog.captureException(`Authentication Error - ${error}`, undefined);
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
  posthog.captureException(err, authSession?.user?.email || v4(), {
    session: JSON.stringify(session),
  });
};

type Forms = "ADMIN_FORM" | "FEEDBACK_FORM";
export const logFormSuccess = async (
  event: Forms,
  userSession?: Session | null,
) => {
  const session = userSession ?? (await auth());
  posthog.capture({
    event: `${event}_SUBMISSION_SUCCESS`,
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
  posthog.captureException(error, session?.user?.email || v4());
};

export const logMvpUpdateFailure = async (
  sessionId: number,
  error: unknown,
  userSession?: Session | null,
) => {
  const session = userSession ?? (await auth());
  posthog.captureException(error, session?.user?.email || v4(), {
    sessionId,
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

export const logDriveCronJobError = (
  message: string,
  additionalInfo?: Record<string, unknown>,
) => {
  after(() => {
    posthog.captureException(message, "cron-job", {
      ...additionalInfo,
    });
  });
};

export const logDriveCronJobSuccess = (
  message: string,
  additionalInfo?: Record<string, unknown>,
) => {
  after(() => {
    posthog.capture({
      event: "drive-read-success",
      distinctId: "cron-job",
      properties: {
        message,
        ...additionalInfo,
      },
    });
  });
};

export const logAiGenSuccess = (
  event: string,
  distinctId: string,
  additionalInfo: Record<string, unknown>,
) => {
  after(() => {
    posthog.capture({
      event,
      distinctId,
      properties: {
        ...additionalInfo,
      },
    });
  });
};

export const logAiGenFailure = (
  error: unknown,
  distinctId: string,
  additionalInfo?: Record<string, unknown>,
) => {
  after(() => {
    posthog.captureException(error, distinctId, {
      ...additionalInfo,
    });
  });
};
