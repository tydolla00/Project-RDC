"use server";

import { auth } from "@/auth";
import { FeedbackType } from "../(routes)/feedback/page";
import { checkBotId } from "botid/server";

export const submitFeedback = async (type: FeedbackType, message: string) => {
  const verification = await checkBotId();
  const session = await auth();
  if (verification.isBot || !session) {
    return { error: "Access denied" };
  }
  //  TODO : Store feedback in database
};
