import { cache } from "react";
import { getAveragePlacing } from "../../../../prisma/lib/marioKart";

const getGame = cache(() => {
  console.log("Hello World");
  return getAveragePlacing();
});

export default async function Page() {
  const game = await getGame();
  return <>About</>;
}
