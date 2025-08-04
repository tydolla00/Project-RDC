"use server";

import { signOut } from "@/auth";

export const userSignOut = async () => await signOut({ redirectTo: "/" });
