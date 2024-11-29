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
      // TODO May want to store our accounts in db and pull through there. Not sure if this insecure, I think it's fine.
      if (
        params.user.name === "tydolla00" ||
        params.user.name === "Shargrove09"
      )
        return true;
      return false;
    },
  },
};

export const { signIn, signOut, handlers, auth } = NextAuth(config);
