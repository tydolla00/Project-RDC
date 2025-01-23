"use client";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { navigationMenuTriggerStyle } from "./ui/navigation-menu";
import { updateAuthStatus } from "@/app/actions/action";
import { ModeToggle } from "./modetoggle";
import { useTransition } from "react";

/**
 * `AuthButton` is a React component that renders a button for authentication actions.
 * It displays "Sign In" if there is no session and "Sign Out" if a session exists.
 * The button's visibility can be controlled based on screen size using the `hideOnSmallScreens` prop.
 *
 * @param {Session | null} session - The current session object or null if not authenticated.
 * @param {boolean} [hideOnSmallScreens] - If true, the button is hidden on small screens and visible on large screens. If false, the button is visible on small screens and hidden on large screens.
 *
 * @returns {JSX.Element} The rendered authentication button component.
 */

export const AuthButton = ({
  session,
  hideOnSmallScreens: hide,
}: {
  session: Session | null;
  hideOnSmallScreens?: boolean | undefined;
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
  return (
    <>
      <ModeToggle className="fixed top-3 right-0 hidden max-[400px]:inline-flex" />
    </>
  );
};
