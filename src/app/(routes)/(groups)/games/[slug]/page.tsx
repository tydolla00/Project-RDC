import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const getGame = (slug: string) => {
  const game = { name: slug };
  return new Promise<typeof game>((resolve, reject) => {
    resolve(game);
  });
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGame(slug);

  return (
    <div className="m-16">
      <H1>{game.name}</H1>
      <Card className="h-64 flex-1">
        <CardHeader>
          <CardTitle>Chart</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
