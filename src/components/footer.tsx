import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

import { games, RDCMembers } from "@/lib/constants";
import { AuthButton } from "./client-buttons";
import { auth } from "@/auth";

export const Footer = async () => {
  const members = Array.from(RDCMembers.entries());
  const session = await auth();
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
            {/* <div>
              {games.map((game) => (
                <Link
                  className="block transition-colors hover:text-white"
                  key={game.url}
                  href={game.url}
                >
                  {game.name}
                </Link>
              ))}
            </div> */}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link className="hover:text-white" href="/members">
              Members
            </Link>
            {/* <div>
              {members.map(([_, { nav: rdc }]) => (
                <Link key={rdc.url} href={rdc.url}>
                  {rdc.name}
                </Link>
              ))}
            </div> */}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AuthButton responsive={false} session={session} />
    </footer>
  );
};
