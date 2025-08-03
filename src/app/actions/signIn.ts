"use server";

import { signIn as authSignIn } from "@/auth";
import { domain } from "@/lib/utils";
import { redirect } from "next/navigation";

export const signIn = async (provider: string) => {
  switch (provider) {
    case "Google":
      await authSignIn("google", { redirectTo: domain });
      break;
    case "Github":
      await authSignIn("github", { redirectTo: domain });
      break;
    default:
      console.error("Invalid provider");
      redirect("/");
  }
};
