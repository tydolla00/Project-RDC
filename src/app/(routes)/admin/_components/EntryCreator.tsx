"use client";
import React, { useState } from "react";
import PlayerSelector from "./PlayerSelector";
import { Game, Match, Player } from "@prisma/client";
import { EnrichedGameSet } from "../../../../../prisma/types/gameSet";
import useAdminFormCreator from "@/lib/hooks/useAdminFormCreator";
import MatchForm from "../../submission/_components/MatchForm";
import * as Separator from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
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

interface Props {
  rdcMembers: Player[];
}

const EntryCreator = ({ rdcMembers }: Props) => {
  const {
    session,
    isInCreationFlow,
    createSession,
    addSetToSession,
    addMatchToSet,
    getNextTempSessionId,
    getNextTempSetId,
    getNextTempMatchId,
    getNextTempPlayerSessionId,
    getNextTempPlayerStatId,
  } = useAdminFormCreator();

  const [selectedPlayers, setSelectedPlayers] = useState<Player[] | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [open, setOpen] = React.useState(false);

  const testGames: Game[] = [
    {
      gameId: 1,
      gameName: "Mario Kart",
    },
    {
      gameId: 2,
      gameName: "Call of Duty",
    },
    {
      gameId: 3,
      gameName: "Gang Beasts",
    },
  ];

  const videoGameDropdown3 = (
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
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold underline">Entry Creator</h2>
      <p className="text-md m-2">
        This is where the admins of the site will create all entries to be
        submitted to the database.{" "}
      </p>
      <button
        className="w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
        onClick={() => createSession(getNextTempSessionId())}
      >
        Start New Session
        {/* Q: How are we going to get the next session id?  */}
      </button>
      {isInCreationFlow && (
        <div
          className="flex flex-col"
          id={`session-${session.sessionId}-container`}
          key={session.sessionId}
        >
          <p className="my-2 text-xl">Session {session.sessionId}</p>
          {/* Session Info */}
          <div
            className="flex flex-row items-center justify-around"
            id={`session-${session.sessionId}-info`}
          >
            {/* URL */}
            <div className="flex flex-col items-center">
              <label className="">Session URL</label>
              <input
                type="text"
                placeholder="URL"
                className="w-80 border p-2"
              />
            </div>
            {/* Video Title */}
            <div className="flex flex-col items-center">
              <label className="">Video Title</label>

              <input
                type="text"
                placeholder="Video Title"
                className="w-80 border p-2"
              />
            </div>
            {/* Game Dropdown */}
            <div className="flex flex-col items-center">
              <label className="">Game</label>

              {videoGameDropdown3}
            </div>
            {/* Player Selector */}
            <div className="flex flex-col items-center">
              <label className="">Player Selector </label>

              <PlayerSelector
                rdcMembers={rdcMembers}
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
              />
            </div>
          </div>
          {/* Set Info */}
          {session.sets &&
            session.sets.map((set: EnrichedGameSet) => (
              <div
                className="m-2 flex flex-col justify-start"
                id={`session-${session.sessionId}-set-${set.setId}-info`}
                key={set.setId}
              >
                {/* Set Id Container*/}
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <p className="m-2 text-lg">Set {set.setId}</p>
                    <input
                      type="text"
                      placeholder="setId"
                      className="w-16 border p-2"
                    />
                  </div>
                  <button
                    className="mr-0 w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
                    onClick={() => addMatchToSet(set.setId)}
                  >
                    {" "}
                    Add match to Set {set.setId}
                  </button>
                </div>
                <Separator.Root className="m-2 h-[1px] w-full bg-slate-800"></Separator.Root>

                {/* Match might need to be custom type to give access to relations */}
                {set.matches &&
                  set.matches.map((match: Match, matchId: number) => (
                    <MatchForm
                      key={matchId}
                      players={selectedPlayers}
                    ></MatchForm>
                  ))}

                {/* Set Winner */}
                <div className="flex flex-col items-center">
                  <p className="text-2xl">Set Winner</p>
                  <PlayerSelector
                    rdcMembers={selectedPlayers ?? []}
                    selectedPlayers={null}
                    setSelectedPlayers={function (
                      value: React.SetStateAction<
                        { playerId: number; playerName: string }[] | null
                      >,
                    ): void {}}
                  ></PlayerSelector>
                </div>
              </div>
            ))}
          {/* Set Btn */}
          <button
            className="m-2 w-56 rounded-sm border border-white p-2 hover:bg-gray-600"
            onClick={async () => addSetToSession(session.sessionId)}
          >
            {" "}
            Add Set to Session {session.sessionId}
          </button>
        </div>
      )}
    </div>
  );
};

export default EntryCreator;
