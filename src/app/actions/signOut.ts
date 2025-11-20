"use server";

import { signOut } from "@/auth";

export const userSignOut = async () => {
  console.log("[auth] sign-out requested");
  await signOut({ redirectTo: "/" });
};
