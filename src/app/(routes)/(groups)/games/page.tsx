import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getAllGames } from "../../../../../prisma/lib/games";

export default async function Page() {
  const games = await getAllGames();
  return (
    <div className="m-16">
      <H1>Games</H1>
      <div className="flex flex-wrap gap-10">
        {games.map((game) => (
          <Card
            key={game.gameId}
            className="group relative w-full overflow-hidden transition-transform duration-700 sm:h-52 sm:w-52"
          >
            <Link
              href={`/games/${game.gameName.replace(/\s/g, "").toLowerCase()}`}
            >
              <Image
                className="h-100 absolute w-full object-cover transition-transform duration-500 group-hover:scale-125"
                fill
                alt=""
                src="https://assets.xboxservices.com/assets/c6/48/c648ccdb-2c6c-4b25-869f-3c109e15015b.jpg?n=000123445_GLP-Page-Hero-0_1083x1222_02.jpg" // remove from nextconfig
              />
              <CardHeader className="relative h-1/4 bg-black bg-opacity-50">
                <CardTitle className="absolute font-extrabold text-white opacity-100">
                  {game.gameName}
                </CardTitle>
              </CardHeader>
            </Link>
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
