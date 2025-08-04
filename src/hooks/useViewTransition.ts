"use client";

const useViewTransition = () => {
  const startTransition = (fn: void) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (!document.startViewTransition) fn;
    else document.startViewTransition(() => fn);
  };

  return { startTransition };
};
export default useViewTransition;
