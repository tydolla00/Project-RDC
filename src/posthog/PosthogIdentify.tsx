"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";

export default function PostHogIdentify() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      posthog.identify(session.user.email);
    }
  }, [session?.user?.email]);

  return null; // This component doesn't render anything
}
// It just ensures PostHog is initialized with the user's email
