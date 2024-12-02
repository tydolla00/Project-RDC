"use client";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { updateAuthStatus } from "@/app/actions/action";

export const AuthButton = ({ session }: { session: Session | null }) => (
  <form
    action={async () => {
      await updateAuthStatus(session);
    }}
  >
    <Button
      className={cn(navigationMenuTriggerStyle(), "w-full")}
      variant="ghost"
    >
      {session ? "Sign Out" : "Sign In"}
    </Button>
  </form>
);
