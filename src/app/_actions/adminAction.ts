"use server";

import prisma from "../../../prisma/db";

export async function getGames() {
  const games = await prisma.game.findMany();
  return games;
}
