"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Control,
  ControllerRenderProps,
  UseFormResetField,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Game } from "@prisma/client";
import { useState, useEffect } from "react";
import { getAllGames } from "../../../../../../prisma/lib/games";
import { FormValues } from "../../_utils/form-helpers";
import { useAdmin } from "@/lib/adminContext";
import { toast } from "sonner";

// TODO Cache results

const GameDropDownForm = ({
  control,
  reset,
}: {
  control: Control<FormValues>;
  field: ControllerRenderProps<FormValues>;
  reset: UseFormResetField<FormValues>;
}) => {
  const [testGames, setTestGames] = useState<Game[]>([]);
  const { getGameStatsFromDb } = useAdmin();

  useEffect(() => {
    const fetchGames = async () => {
      const games = await getAllGames();
      if (!games.success || !games.data)
        toast.error("Failed to fetch games. Please try again.");
      else setTestGames(games.data);
    };
    fetchGames();
    getGameStatsFromDb("Mario Kart 8"); // ! TODO TEMP FIX to load games due to needing to pass game as default value in form
  }, []);

  return (
    <FormField
      control={control}
      name="game"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="w-fit">Game</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? testGames.find((game) => game.gameName === field.value)
                        ?.gameName
                    : "Select Game"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No game found.</CommandEmpty>
                  <CommandGroup>
                    {testGames.map((game) => (
                      <CommandItem
                        value={game.gameName}
                        key={game.gameId}
                        onSelect={async () => {
                          try {
                            field.onChange(game.gameName);
                            reset("sets");
                            await getGameStatsFromDb(game.gameName);
                          } catch (error) {
                            console.error("Failed to fetch game stats:", error);
                            toast.error(
                              "Failed to fetch game stats. Please try again.",
                            );
                          }
                        }}
                      >
                        {game.gameName}
                        <Check
                          className={cn(
                            "ml-auto",
                            game.gameName === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GameDropDownForm;
