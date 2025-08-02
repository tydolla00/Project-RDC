import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { logAuthError, logAuthEvent } from "./lib/analytics";

export const config: NextAuthConfig = {
  providers: [GitHub, Google],
  pages: {
    signIn: "/signin",
    error: "/not-allowed",
  },
  logger: {
    async error(error) {
      console.log(error.cause);
      console.log(error.stack);
      logAuthError(error);
    },
  },
  callbacks: {
    async signIn(params) {
      const provider = params.account?.provider;
      let user: string = "";
      switch (provider) {
        case "github":
          user = (params.profile?.login as string)?.toLowerCase();
          break;
        case "google":
          user = params.user.email as string;
          break;
      }
      console.log(user);
      if (user === "tydolla00" || user === "shargrove09") {
        logAuthEvent("signin", params.user.email!);
        return true;
      }
      return false; // Flip when ready to go live
    },
  },
};

export const { signIn, signOut, handlers, auth } = NextAuth(config);
