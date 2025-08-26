"use server";

import { signIn as authSignIn } from "@/auth";
import { domain } from "@/lib/utils";
import { redirect } from "next/navigation";
/**
 * Server action to handle user authentication via third-party providers
 *
 * @param provider - The authentication provider ("Google" or "Github")
 * @throws Redirects to root path for invalid providers
 */
export const signIn = async (provider: string) => {
  switch (provider.toLowerCase()) {
    case "google":
      await authSignIn("google", { redirectTo: domain });
      break;
    case "github":
      await authSignIn("github", { redirectTo: domain });
      break;
    default:
      console.error("Invalid provider");
      redirect("/");
  }
};
