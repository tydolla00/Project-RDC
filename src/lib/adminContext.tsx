"use client";

import { createContext } from "react";
import { PrismaClient } from "@prisma/client";

export const AdminContext = createContext({});

const prisma = new PrismaClient();

const getGames = async () => {
  const games = await prisma.game.findMany();
  return games;
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminContext.Provider value="dark">{children}</AdminContext.Provider>;
}
