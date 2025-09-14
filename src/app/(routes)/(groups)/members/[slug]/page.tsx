import { notFound } from "next/navigation";
import { getMember } from "./data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { getAllMembers } from "prisma/lib/members";
import { PLAYER_MAPPINGS } from "@/app/(routes)/admin/_utils/player-mappings";

export const dynamicParams = false; // true | false,

export async function generateStaticParams() {
  const members = await getAllMembers();
  if (!members.success || !members.data) {
    console.error("Failed to fetch members");
    return [];
  }
  return members.data.map((member) => ({
    slug: member.playerName.toLowerCase(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getMember(slug);

  if (!member.success || !member.data) notFound();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image
              src={
                PLAYER_MAPPINGS[
                  member.data.playerName as keyof typeof PLAYER_MAPPINGS
                ].image
              }
              alt={member.data.playerName}
              width={100}
              height={100}
              className="rounded-full"
            />
            <div>
              <CardTitle className="text-4xl">
                {member.data.playerName}
              </CardTitle>
              <CardDescription>Member of RDC</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Win Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Matches Won: {member.data.matchWins.length}</p>
                <p>Sets Won: {member.data.setWins.length}</p>
                <p>Days Won: {member.data.dayWins.length}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
