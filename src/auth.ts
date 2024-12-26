import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const config: NextAuthConfig = {
  providers: [GitHub],
  pages: {
    signIn: "/signin",
    error: "/not-allowed",
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
