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
export const Navbar = () => {
  const links = [
    { text: "Home", ref: "" },
    { text: "About", ref: "about" },
  ];

  const games: { desc?: string; url: string; name: string }[] = [
    {
      desc: "Stats from the most intense 3v3 battles.",
      url: "/games/rocketleague",
      name: "Rocket League",
    },
    {
      desc: "Stats that tell you who touches the most paper.",
      url: "/games/lethalcompany",
      name: "Lethal Company",
    },
    {
      desc: "Stats for FFA's and who sells the most online.",
      url: "/games/callofduty",
      name: "Call of Duty",
    },
    {
      desc: "Stats that tell you who races the hardest.",
      url: "/games/mariokart",
      name: "Mario Kart",
    },
    {
      desc: "Stats that tell you who races the hardest.",
      url: "/games/speedrunners",
      name: "Speedrunners",
    },
    {
      url: "/games",
      name: "Browse all games",
    },
  ];

  const members = [
    { alt: "RDC Mark", name: "Cash Money Mawk", url: "/members/mark" },
    { alt: "RDC Leland", name: "Meland", url: "/members/leland" },
    { alt: "RDC Des", name: "Big Booty Des", url: "/members/des" },
    { alt: "RDC Ben", name: "LaBen James", url: "/members/ben" },
    { alt: "Ippi", name: "Iceman Ip", url: "/members/ippi" },
    { alt: "RDC John", name: "John", url: "/members/john" },
    { alt: "RDC Aff", name: "Aff", url: "/members/aff" },
    { alt: "", name: "Browse all members", url: "/members" },
  ];

  const signedIn = false;

  return (
    <NavigationMenu className="sticky top-0 mx-auto">
      <NavigationMenuList>
        {links.map(({ text, ref }, i) => (
          <NavigationMenuItem
            className={navigationMenuTriggerStyle()}
            key={ref}
          >
            <Link href={`/${ref}`}>
              <FillText className="text-chart-4" text={text} />
            </Link>
          </NavigationMenuItem>
        ))}
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
                  <Image alt={rdc.alt} src={Icon} height={60} width={60} />
                  <ListItem href={rdc.url} title={rdc.name} />
                </div>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {process.env.NODE_ENV === "development" && (
            <Link className={navigationMenuTriggerStyle()} href="/admin">
              <FillText className="text-chart-4" text="Admin" />
            </Link>
          )}
        </NavigationMenuItem>
        <NavigationMenuItem>
          {process.env.NODE_ENV === "development" && (
            <Link className={navigationMenuTriggerStyle()} href="/submission">
              <FillText className="text-chart-4" text="Submissions" />
            </Link>
          )}
        </NavigationMenuItem>
        <NavigationMenuItem>
          {process.env.NODE_ENV === "development" && !signedIn ? (
            <Link className={navigationMenuTriggerStyle()} href="/signin">
              <FillText className="text-chart-4" text="Sign In" />
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarImage src={Icon.src} />
                    <AvatarFallback>Icon</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>User signed in</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href = "", ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
