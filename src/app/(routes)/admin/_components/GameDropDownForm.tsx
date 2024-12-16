"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Control, ControllerRenderProps } from "react-hook-form";

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
import { getGames } from "@/app/actions/adminAction";
import { Game } from "@prisma/client";
import { useState, useEffect } from "react";
import { FormValues } from "../_utils/form-helpers";

const GameDropDownForm = ({
  control,
}: {
  control: Control<FormValues>;
  field: ControllerRenderProps<FormValues>;
}) => {
  const [testGames, setTestGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      // TODO Maybe bring in Tanstack Query?
      const games = await getGames();
      setTestGames(games);
    };
    fetchGames();
  }, []);

  return (
    <FormField
      control={control}
      name="game"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Game</FormLabel>
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
                        onSelect={() => {
                          field.onChange(game.gameName);
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
