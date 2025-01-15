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
import { RDCMembers } from "@/lib/constants";

// TODO Revalidate Stats Once Per Week
// TODO Show all button that displays all Members. Default is centered 3D circular card that pops up from the 'ground'

export default async function Page() {
  const members = Array.from(RDCMembers.entries());
  return (
    <div className="m-16">
      <H1>Members</H1>
      <div className="flex flex-wrap justify-center gap-10">
        {members.map(([member, { desc, stat1, stat2, stat3, nav: rdc }]) => (
          <HoverCard key={member} openDelay={200} closeDelay={200}>
            <HoverCardTrigger asChild>
              <Link
                className="group/fill overflow-hidden"
                href={`/members/${member}`}
                key={member}
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
                    text={member}
                  />
                </div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent align="center" side="right">
              <H3>{member}</H3>
              <i className="leading-7 text-muted-foreground">{desc}</i>
              <p className="mt-2 font-bold">{stat1.prop}</p>
              <p className="mb-6 text-muted-foreground">{stat1.val}</p>
              <p className="mt-2 font-bold">{stat2.prop}</p>
              <p className="mb-6 text-muted-foreground">{stat2.val}</p>
              <p className="mt-2 font-bold">{stat3.prop}</p>
              <p className="mb-6 text-muted-foreground">{stat3.val}</p>
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
