import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const domain =
  process.env.NODE_ENV === "production"
    ? "https://project-rdc.vercel.app"
    : "http://localhost:3000";

export const isProduction = process.env.NODE_ENV === "production";
