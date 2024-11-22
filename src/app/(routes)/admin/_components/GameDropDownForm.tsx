"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useController, Control, useForm } from "react-hook-form";

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
  Form,
  FormControl,
  FormDescription,
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
import { getGames } from "@/app/_actions/adminAction";
import { Game } from "@prisma/client";
import { useState, useEffect } from "react";
import { formSchema } from "./EntryCreatorForm";
import { z } from "zod";

const GameDropDownForm = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) => {
  const [testGames, setTestGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
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
        <FormItem className="flex flex-col items-center">
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
          <FormDescription>
            Game of the session. This will be used to categorize the session.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GameDropDownForm;
