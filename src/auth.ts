import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import posthog from "posthog-js";
import PostHogClient from "./lib/posthog";

export const config: NextAuthConfig = {
  providers: [GitHub],
  pages: {
    signIn: "/signin",
    error: "/not-allowed",
  },
  logger: {
    async error(error) {
      const posthog = PostHogClient();
      const session = await auth();
      posthog.capture({
        event: `Authentication Error - ${error}`,
        distinctId: session?.user?.email ?? "Unidentified Email",
      });
      posthog.shutdown();
    },
  },
  callbacks: {
    async signIn(params) {
      const username = (params.profile?.login as string).toLowerCase();
      if (username === "tydolla00" || username === "shargrove09") return true;
      return false;
    },
  },
};

export const { signIn, signOut, handlers, auth } = NextAuth(config);
