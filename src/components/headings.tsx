import { cn } from "@/lib/utils";
import * as React from "react";

export const H1 = ({ id, children, className }: HeaderProps) => (
  <h1 id={id} className={cn("my-6 text-3xl font-bold", className)}>
    {children}
  </h1>
);

export const H2 = ({ id, children, className }: HeaderProps) => (
  <h2 id={id} className={cn("text-2xl font-semibold", className)}>
    {children}
  </h2>
);

export const H3 = ({ id, children, className }: HeaderProps) => (
  <h3 id={id} className={cn("text-xl font-semibold", className)}>
    {children}
  </h3>
);

type HeaderProps = {
  id?: string;
  children?: React.ReactNode;
  className?: string;
};
