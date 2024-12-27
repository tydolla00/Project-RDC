import { H1 } from "@/components/headings";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getAllGames } from "../../../../../prisma/lib/games";
import { gameImages } from "@/lib/constants";

export default async function Page() {
  const games = await getAllGames();
  return (
    <div className="m-16">
      <H1>Games</H1>
      <div className="flex-wra flex justify-center gap-10">
        {games.map((game) => {
          const gameName = game.gameName.replace(/\s/g, "").toLowerCase();
          return (
            <Card
              key={game.gameId}
              className="group relative aspect-square h-52 w-full min-w-24 overflow-hidden transition-transform duration-700 sm:w-52"
            >
              <Link href={`/games/${gameName}`}>
                <Image
                  className="h-100 absolute w-full object-cover transition-transform duration-500 group-hover:scale-125"
                  fill
                  alt=""
                  src={`/images/${gameImages[gameName as keyof typeof gameImages]}`} // remove from nextconfig
                />
                <CardHeader className="relative h-1/4 bg-black bg-opacity-50">
                  <CardTitle className="absolute font-extrabold text-white opacity-100">
                    {game.gameName}
                  </CardTitle>
                </CardHeader>
              </Link>
            </Card>
          );
        })}
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
