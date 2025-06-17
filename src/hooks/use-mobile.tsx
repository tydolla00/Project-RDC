import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * A custom hook that detects if the current viewport is mobile-sized
 *
 * @description
 * This hook:
 * 1. Uses a media query to detect viewport width
 * 2. Updates state when viewport size changes
 * 3. Uses a constant breakpoint of 768px
 * 4. Returns undefined until client-side hydration completes
 *
 * @returns boolean indicating if viewport is mobile-sized, or undefined during SSR
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Show mobile layout
 * }
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
