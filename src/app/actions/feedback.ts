"use server";

import { auth } from "@/auth";
import { logFormSuccess } from "@/posthog/server-analytics";
import { checkBotId } from "botid/server";
import { handlePrismaOperation } from "prisma/db";

export type FeedbackType = "bug" | "feature" | "general" | "other";

export const submitFeedback = async (
  state: { error: string | null } | undefined,
  formData: FormData,
) => {
  try {
    const verification = await checkBotId();
    const session = await auth();
    if (verification.isBot || !session) {
      console.warn("[feedback] Submission blocked", {
        reason: verification.isBot ? "bot_detected" : "unauthenticated",
        hasSession: Boolean(session),
      });
      return { error: "Access denied" };
    }

    const feedback: FeedbackType = formData.get("type") as FeedbackType;
    const message = formData.get("message") as string;
    const userEmail = session?.user?.email;

    switch (feedback) {
      case "feature":
      case "general":
      case "other":
      case "bug":
        break;
      default:
        console.warn("[feedback] Invalid feedback type", { feedback });
        return { error: "Invalid feedback type" };
    }

    if (message.trim().length === 0) {
      console.warn("[feedback] Empty feedback message", { userEmail });
      return { error: "Message cannot be empty" };
    }

    const res = await handlePrismaOperation((prisma) =>
      prisma.feedback.create({
        data: {
          type: feedback,
          message,
          userEmail: userEmail!,
        },
      }),
    );

    if (!res.success) throw new Error(res.error);
    console.log("[feedback] Stored feedback entry", {
      type: feedback,
      userEmail,
      id: res.data.id,
    });

    logFormSuccess("FEEDBACK_FORM", session);
    return { error: null };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { error: "Failed to submit feedback" };
  }
};
