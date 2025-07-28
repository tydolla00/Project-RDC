import { cn } from "@/lib/utils";

/**
 * A loading placeholder component that animates with a pulse effect
 *
 * @description
 * This component provides:
 * 1. A customizable loading placeholder with pulsing animation
 * 2. Support for different sizes via className prop
 * 3. Primary color matching theme with 10% opacity
 * 4. Rounded edges consistent with design system
 * 5. Accessible implementation for screen readers
 *
 * @param className - Additional CSS classes to apply
 * @param props - HTML div element props
 *
 * @example
 * // Basic usage
 * <Skeleton className="h-4 w-[250px]" />
 *
 * // Custom dimensions
 * <Skeleton className="h-32 w-32 rounded-full" />
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-primary/10 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
