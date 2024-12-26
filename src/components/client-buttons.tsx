"use client";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { updateAuthStatus } from "@/app/actions/action";
import { ModeToggle } from "./modetoggle";
import { useTransition } from "react";

export const AuthButton = ({
  session,
  responsive: hide,
}: {
  session: Session | null;
  responsive?: boolean | undefined; // ? If true hide on small screens if false hide on big screens
}) => {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() => {
        startTransition(async () => await updateAuthStatus(session));
      }}
    >
      <Button
        disabled={isPending}
        className={cn(
          navigationMenuTriggerStyle(),
          "w-full",
          hide ? "hidden sm:block" : "sm:hidden",
        )}
        variant="ghost"
      >
        {session ? "Sign Out" : "Sign In"}
      </Button>
    </form>
  );
};

export const ToggleThemeButton = () => {
  // TODO Figure out a better way to show this.
  return (
    <>
      {/* <Button type="button" variant="ghost">
        Toggle Theme
      </Button> */}
      <ModeToggle className="fixed right-0 top-3 hidden max-[400px]:inline-flex" />
    </>
  );
};
