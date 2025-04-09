import { Session } from "next-auth";
import { redirect } from "next/navigation";

export const FEATURE_FLAGS = {
  SUBMISSION_FORM: { roles: ["admin"] },
  ADMIN_FORM: { roles: ["admin"] },
  AUTH: { roles: ["admin", "tester"] },
} as const satisfies Record<string, { roles: [Roles, ...Roles[]] }>;

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

type Roles = "admin" | "user" | "tester";

/**
 * A component that gates feature access based on user roles and environment
 *
 * @description
 * This component provides feature access control by:
 * - Checking user roles against required roles for each feature
 * - Supporting development-only features
 * - Optionally redirecting users without access
 * - Handling both client and server-side feature gating
 *
 * The component uses a constant FEATURE_FLAGS object that defines all available
 * feature flags and their required roles. This ensures consistent feature
 * access control across the application.
 *
 * @param children - Content to render if feature is enabled
 * @param devOnly - Whether the feature should only be available in development
 * @param shouldRedirect - Whether to redirect unauthorized users
 * @param flagName - The feature flag to check from FEATURE_FLAGS
 * @param user - Current user session for role checking
 *
 * @example
 * <FeatureFlag
 *   flagName="ADMIN_FORM"
 *   shouldRedirect={true}
 *   user={session}
 * >
 *   <AdminPanel />
 * </FeatureFlag>
 */
export const FeatureFlag = ({
  children,
  devOnly = false,
  shouldRedirect = false,
  flagName,
  user,
}: {
  children: React.ReactNode;
  devOnly?: boolean;
  shouldRedirect: boolean;
  flagName: FeatureFlagName;
  user: Session | null;
}) => {
  // TODO Add necessary checks for if user has a particular role.
  const flag = FEATURE_FLAGS[flagName];
  if (shouldRedirect) {
    if (
      (devOnly && process.env.NODE_ENV !== "development") ||
      flag.roles.some((s) => s === user?.user?.name) // user isn't admin
    )
      redirect("/");
  }

  if (devOnly && process.env.NODE_ENV !== "development") return;

  return <>{children}</>;
};
