"use server";

import { Game } from "@prisma/client";
import prisma from "../../../prisma/db";

/**
 * Get all game objects from the database
 *
 * @returns {Promise<Game[]>} A promise that resolves to an array of game objects
 */
export async function getGames(): Promise<Game[]> {
  const games = await prisma.game.findMany();
  return games;
}
