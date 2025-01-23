import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./modetoggle";
import { FillText } from "./fill-text";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Icon from "@/app/favicon.ico";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { getGamesNav, getMembersNav } from "@/lib/constants";
import { FeatureFlag } from "@/lib/featureflag";
import { auth } from "@/auth";
import { AuthButton, ToggleThemeButton } from "./client-buttons";

export const Navbar = async () => {
  const session = await auth();
  const games = await getGamesNav();
  const members = await getMembersNav();

  // TODO Memoize this component, so it doesn't ever rerender? Which it never should.

  return (
    <NavigationMenu className="sticky top-0 z-20 mx-auto w-screen bg-inherit">
      <NavigationMenuList>
        <NavigationMenuItem className={navigationMenuTriggerStyle()}>
          <Link href="/">
            <FillText text="Home" className="text-chart-4" />
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem
          className={cn(navigationMenuTriggerStyle(), "hidden md:block")}
        >
          <Link href="/about">
            <FillText text="About" className="text-chart-4" />
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <FillText className="text-chart-4" text="Games" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {games.map((game) => (
                <ListItem key={game.url} href={game.url} title={game.name}>
                  {game.desc}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <FillText className="text-chart-4" text="Members" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {members.map((rdc) => (
                <div key={rdc.url} className="flex gap-5">
                  <Avatar>
                    <Image
                      alt={rdc.alt}
                      src={rdc.src || Icon}
                      height={60}
                      width={60}
                    />
                  </Avatar>
                  <ListItem
                    className="shrink-0"
                    href={rdc.url}
                    title={rdc.navName}
                  />
                </div>
              ))}
              <ListItem
                className="col-span-full"
                href="/members"
                title="Browse all members"
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <FeatureFlag
            devOnly
            shouldRedirect={false}
            user={session}
            flagName="ADMIN_FORM"
          >
            <Link className={navigationMenuTriggerStyle()} href="/admin">
              <FillText className="text-chart-4" text="Admin" />
            </Link>
          </FeatureFlag>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <FeatureFlag
            devOnly
            shouldRedirect={false}
            flagName="SUBMISSION_FORM"
            user={session}
          >
            <Link className={navigationMenuTriggerStyle()} href="/submission">
              <FillText className="text-chart-4" text="Submissions" />
            </Link>
          </FeatureFlag>
        </NavigationMenuItem>

        {/* MOBILE */}
        <NavigationMenuItem className="md:hidden">
          <NavigationMenuTrigger>
            <HamburgerMenuIcon />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <ListItem href="/about">About</ListItem>
              <ListItem href="/admin">Admin</ListItem>
              <ListItem href="/submission">Submissions</ListItem>
              <AuthButton hideOnSmallScreens={false} session={session} />
              <ToggleThemeButton />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* END MOBILE */}

        <FeatureFlag
          shouldRedirect={false}
          flagName="AUTH"
          user={session}
          devOnly
        >
          <NavigationMenuItem className="hidden sm:block">
            {session && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar asChild>
                      <Link href="/profile">
                        <AvatarImage src={session.user?.image || Icon.src} />
                        <AvatarFallback>Icon</AvatarFallback>
                      </Link>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{session.user?.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </NavigationMenuItem>
        </FeatureFlag>
        <AuthButton hideOnSmallScreens session={session} />
        <NavigationMenuItem className="hidden sm:block">
          <ModeToggle className="" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href = "", ...props }, ref) => {
  return (
    <li className="grow">
      <NavigationMenuLink asChild>
        <Link
          prefetch={true}
          href={href}
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
