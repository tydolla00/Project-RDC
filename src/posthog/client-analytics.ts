"use client";

import posthog from "posthog-js";
import { PostHogEvents } from "./events";

export const logChartHoverToggle = (enabled: boolean, gameName: string) => {
  posthog.capture(PostHogEvents.CHART_HOVER_TOGGLE, {
    enabled,
    gameName,
  });
};

export const logChartTabClick = (tabName: string, gameName?: string) => {
  posthog.capture(PostHogEvents.CHART_TAB_CLICKED, {
    tabName,
    gameName,
  });
};

export const logThemeToggle = (theme: string) => {
  posthog.capture(PostHogEvents.THEME_TOGGLED, {
    theme,
  });
};
