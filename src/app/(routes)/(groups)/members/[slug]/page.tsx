import { H1 } from "@/components/headings";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllMembers } from "../../../../../../prisma/lib/members";

export const dynamicParams = false; // true | false,

export async function generateStaticParams() {
  const members = await getAllMembers();
  return members.map((member) => ({
    slug: member.playerName.toLowerCase(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const memberName = slug.slice(0, 1).toUpperCase() + slug.slice(1);

  return (
    <div className="m-16">
      <H1>{memberName}</H1>
      <Card className="h-64 flex-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
      </Card>
      <div className="mt-10 flex flex-wrap gap-10">
        <Card className="h-64 flex-1">
          <CardHeader>
            <CardTitle>Chart</CardTitle>
            <CardDescription>Ranking</CardDescription>
          </CardHeader>
        </Card>
        <Card className="h-64 flex-1">
          <CardHeader>
            <CardTitle>Chart</CardTitle>
            <CardDescription>Ranking</CardDescription>
          </CardHeader>
        </Card>
        <Card className="h-64 flex-1">
          <CardHeader>
            <CardTitle>Chart</CardTitle>
            <CardDescription>Ranking</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
