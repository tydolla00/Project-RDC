import { PostHog } from "posthog-node";
import config from "@/lib/config";

/**
 * A single, shared PostHog client instance.
 *
 * @description
 * This client is configured with environment settings for:
 * 1. API key
 * 2. Host URL
 * 3. Immediate event flushing for real-time analytics
 * 4. Disabled automatic flush intervals for better control
 */
const posthog = new PostHog(config.NEXT_PUBLIC_POSTHOG_KEY, {
  host: config.NEXT_PUBLIC_POSTHOG_HOST,
  flushAt: 1,
  flushInterval: 0,
});

export default posthog;