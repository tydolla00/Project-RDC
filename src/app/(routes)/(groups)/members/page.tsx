import { H1, H3 } from "@/components/headings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/app/favicon.ico";
import Link from "next/link";
import { FillText } from "@/components/fill-text";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const getAllMembers = () => {
  const members = new Map<string, MembersProps>([
    [
      "Mark",
      {
        desc: "Director, animator, Mark is the founder and creator of RDC. He is one of the better gamers in RDC and plays as such.",
        stat1: { prop: "Best Rocket League Player", val: "#1" },
        stat2: { prop: "Dragon Ball Sparking Zero", val: "#2" },
        stat3: { prop: "Scariest Gamer", val: "Most deaths in Lethal Company" },
      },
    ],
    [
      "Ippi",
      {
        desc: "Ippi is a newcomer in the eyes of RDC, while not yet an official member of RDC yet, one can assume that it's only a matter of time as he has been beating down the crew in Golf and Mario Kart.",
        stat1: { prop: "", val: "" },
        stat2: { prop: "", val: "" },
        stat3: { prop: "", val: "" },
      },
    ],
    [
      "John",
      {
        desc: "If you've ever seen or been to Dreamcon, this man has had a hand in it. Don't let his sorry gaming skills fool you, John is very valuable in the backend and his contributions should not go unnoticed. Don't forget his immaculate singing ability, John is clearly the best singer in RDC.",
        stat1: { prop: "", val: "" },
        stat2: { prop: "", val: "" },
        stat3: { prop: "", val: "" },
      },
    ],
    [
      "Aff",
      {
        desc: "Aff and his turtle bring a lot to RDC. Give aff for giving us all the laughs, memes, and behind the scenes work that he contributes to.",
        stat1: { prop: "", val: "" },
        stat2: { prop: "", val: "" },
        stat3: { prop: "", val: "" },
      },
    ],
    [
      "Leland",
      {
        desc: "I love it when you talk to me, my cash machine, my cash machine. The old man laugh always get us. While Leland is really sorry at most games, don't try to play him in any fighting game. You are most likely to get beat up.",
        stat1: { prop: "", val: "" },
        stat2: { prop: "", val: "" },
        stat3: { prop: "", val: "" },
      },
    ],
    [
      "Dylan",
      {
        desc: "The tech guru, the thriller in manilla, el luchador. Dylan is a huge component in the puzzle that is RDC. The flawless streams are thanks to Dylan. He is one of the top gamers in the group although recently he has been falling lower in the ranking of rdc members.",
        stat1: { prop: "", val: "" },
        stat2: { prop: "", val: "" },
        stat3: { prop: "", val: "" },
      },
    ],
    [
      "Ben",
      {
        desc: "Ben is a very average gamer. Somethings he is good at and other's hes not. It's hard to explain. Ben gets it done. He works well and if he leaves again he's dead to us.",
        stat1: { prop: "", val: "" },
        stat2: { prop: "", val: "" },
        stat3: { prop: "", val: "" },
      },
    ],
    [
      "Desmond",
      {
        desc: "How greeeeeeeat is our God. Ranking as the 2nd best singer in RDC Desmond is surprisingly a very good gamer. You would think the dementia would affect Des but the rage and enthusiasm he plays with always uplifts him in the end. Also Desmond, how is Crystal?",
        stat1: { prop: "", val: "" },
        stat2: { prop: "", val: "" },
        stat3: { prop: "", val: "" },
      },
    ],
  ]);
  return new Promise<ReturnType<(typeof members)["entries"]>>(
    (resolve, reject) => {
      resolve(members.entries());
    },
  );
};

export default async function Page() {
  const members = Array.from(await getAllMembers());
  return (
    <div className="m-16">
      <H1>Games</H1>
      <div className="flex flex-wrap justify-center gap-10">
        {members.map(([member, { desc, stat1, stat2, stat3 }]) => (
          <HoverCard openDelay={300}>
            <HoverCardTrigger asChild>
              <Link
                className="group/fill"
                href={`/members/${member}`}
                key={member}
              >
                <Avatar className="h-32 w-32">
                  <AvatarImage src={Icon.src} />
                  <AvatarFallback>{member}</AvatarFallback>
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

type MembersProps = {
  desc: string;
  stat1: { prop: string; val: string };
  stat2: { prop: string; val: string };
  stat3: { prop: string; val: string };
};
