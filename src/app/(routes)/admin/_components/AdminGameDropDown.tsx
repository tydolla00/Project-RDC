"use client";
import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Game } from "@prisma/client";
import { getGames } from "@/app/_actions/adminAction";

const AdminGameDropDown = () => {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [testGames, setTestGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const games = await getGames();
      setTestGames(games);
    };
    fetchGames();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedGame?.gameId
            ? testGames.find((game) => game.gameId === selectedGame.gameId)
                ?.gameName
            : "Select games..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search games..." />
          <CommandList>
            <CommandEmpty>No game found.</CommandEmpty>
            <CommandGroup>
              {testGames.map((game) => (
                <CommandItem
                  key={game.gameId}
                  value={game.gameName}
                  onSelect={(gameId) => {
                    setSelectedGame(
                      gameId === game.gameId.toString() ? null : game,
                    );
                    setOpen(false);
                  }}
                >
                  {game.gameName}
                  <Check
                    className={cn(
                      "ml-auto",
                      game.gameId === game.gameId ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AdminGameDropDown;
