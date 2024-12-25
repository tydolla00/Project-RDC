import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../prisma/db";

export const config: NextAuthConfig = {
  // adapter: PrismaAdapter(prisma),
  providers: [GitHub],
  pages: {
    signIn: "/signin",
    error: "/not-allowed",
  },
  callbacks: {
    async signIn(params) {
      // Users are successfully saving in DB, but getting runtime error.
      const username = (params.profile?.login as string).toLowerCase();
      // console.log(username);
      // TODO May want to store our accounts in db and pull through there. Not sure if this insecure, I think it's fine.
      if (username === "tydolla00" || username === "shargrove09") return true;
      return false;
    },
  },
};

export const { signIn, signOut, handlers, auth } = NextAuth(config);
