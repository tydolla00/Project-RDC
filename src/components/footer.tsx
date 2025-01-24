import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ModeToggle } from "./modetoggle";

export const Footer = () => {
  return (
    <footer className="relative bottom-0 h-72 border-t-2 border-t-stone-800">
      <Breadcrumb className="mx-auto my-6 w-fit">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/about">About</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="flex flex-col">
            <Link className="hover:text-white" href="/games">
              Games
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link className="hover:text-white" href="/members">
              Members
            </Link>
          </BreadcrumbItem>
          <ModeToggle />
        </BreadcrumbList>
      </Breadcrumb>
    </footer>
  );
};
