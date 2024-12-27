import { PostHog } from "posthog-node";
import config from "@/lib/config";

export default function PostHogClient() {
  const posthogClient = new PostHog(config.NEXT_PUBLIC_POSTHOG_KEY, {
    host: config.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}
