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
export const Navbar = () => {
  const links = [
    { text: "Home", ref: "" },
    { text: "About", ref: "about" },
  ];

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
              <ListItem href="/games/rocketleague" title="Rocket League">
                Stats from the most intense 3v3 battles.
              </ListItem>
              <ListItem href="/games/lethalcompany" title="Lethal Company">
                Stats that tell you who touches the most paper.
              </ListItem>
              <ListItem href="/games/callofduty" title="Call of Duty">
                Stats for FFA&apos;s and who sells the most online.
              </ListItem>
              <ListItem href="/games/mariokart" title="Mario Kart">
                Stats that tell you who races the hardest.
              </ListItem>
              <ListItem href="/games/speedrunners" title="Speedrunners">
                Stats that tell you who races the hardest.
              </ListItem>
            </ul>
          </NavigationMenuContent>
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
