"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function BreadcrumbNav() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {pathname
          .split("/")
          .filter(Boolean)
          .map((segment, index, array) => {
            const href = `/${array.slice(0, index + 1).join("/")}`;
            const isLast = index === array.length - 1;
            const label = segment.charAt(0).toUpperCase() + segment.slice(1);

            // If there's an ID in the path (for review pages)
            const isId = !isNaN(Number(segment));
            if (isId) {
              return null;
            }

            return (
              <Fragment key={href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                    </>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
