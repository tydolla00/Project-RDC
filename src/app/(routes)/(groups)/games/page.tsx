import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const getAllGames = () => {
  return new Promise<string[]>((resolve, reject) => {
    resolve([
      "MarioKart",
      "Call of Duty",
      "Lethal Company",
      "Rocket League",
      "Speedrunners",
    ]);
  });
};

export default async function Page() {
  const games = await getAllGames();
  return (
    <div className="m-16">
      <H1>Games</H1>
      <div className="flex gap-10">
        {games.map((game) => (
          <Card className="h-64 w-64" key={game}>
            <CardHeader>
              <CardTitle>{game}</CardTitle>
            </CardHeader>
          </Card>
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
