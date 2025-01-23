import { H1, H3 } from "@/components/headings";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/app/favicon.ico";
import Link from "next/link";
import { FillText } from "@/components/fill-text";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getMembersNav } from "@/lib/constants";

// TODO Revalidate Stats Once Per Week
// TODO Show all button that displays all Members. Default is centered 3D circular card that pops up from the 'ground'

export default async function Page() {
  const members = await getMembersNav();
  return (
    <div className="m-16">
      <H1>Members</H1>
      <div className="flex flex-wrap justify-center gap-10">
        {members.map((rdc) => (
          <HoverCard key={rdc.name} openDelay={200} closeDelay={200}>
            <HoverCardTrigger asChild>
              <Link
                className="group/fill overflow-hidden"
                href={rdc.url}
                key={rdc.name}
              >
                <Avatar className="h-32 w-32">
                  <Image
                    className="transition-transform duration-500 group-hover/fill:scale-125"
                    alt={rdc.alt}
                    src={rdc.src || Icon}
                    height={128}
                    width={128}
                  />
                </Avatar>
                <div className="mx-auto w-fit">
                  <FillText
                    overrideGroup
                    className="text-chart-4"
                    text={rdc.name}
                  />
                </div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent align="center" side="right">
              <H3>{rdc.name}</H3>
              <i className="text-muted-foreground leading-7">{rdc.desc}</i>
              {rdc.stats.map((stat, index) => (
                <div key={index}>
                  <p className="mt-2 font-bold">{stat.prop}</p>
                  <p className="text-muted-foreground mb-6">{stat.val}</p>
                </div>
              ))}
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
      <div className="mt-10 flex gap-10">
        <Card className="h-64 flex-1">
          <CardHeader>
            <CardTitle>Chart</CardTitle>
          </CardHeader>
        </Card>
        <Card className="h-64 flex-1">
          <CardHeader>
            <CardTitle>Chart</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
