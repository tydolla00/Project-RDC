"use client";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { updateAuthStatus } from "@/app/actions/action";
import { ModeToggle } from "./modetoggle";
import { useState } from "react";

export const AuthButton = ({
  session,
  responsive: hide,
}: {
  session: Session | null;
  responsive?: true | undefined;
}) => {
  const [isDisabled, setIsDisabled] = useState(false);
  return (
    <form
      action={async () => {
        // TODO Disabling button not working -_-
        setIsDisabled(true);
        setTimeout(async () => {
          await updateAuthStatus(session);
          setIsDisabled(false);
        }, 500);
      }}
    >
      <Button
        disabled={isDisabled}
        className={cn(
          navigationMenuTriggerStyle(),
          "w-full",
          hide && "hidden sm:block",
        )}
        variant="ghost"
      >
        {session ? "Sign Out" : "Sign In"}
      </Button>
    </form>
  );
};

export const ToggleThemeButton = () => {
  return (
    <>
      {/* <Button type="button" variant="ghost">
        Toggle Theme
      </Button> */}
      <ModeToggle className="fixed bottom-0 right-0" />
    </>
  );
};
