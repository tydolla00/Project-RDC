"use client";
import React, { useState } from "react";
import PlayerSelector from "./PlayerSelector";
import { Game, Match, Player } from "@prisma/client";
import { EnrichedGameSet } from "../../../../../prisma/types/gameSet";
import useAdminFormCreator from "@/lib/hooks/useAdminFormCreator";
import MatchForm from "../../submission/_components/MatchForm";
import * as Separator from "@radix-ui/react-separator";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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
  } = useAdminFormCreator();

  const [selectedPlayers, setSelectedPlayers] = useState<Player[] | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [sessionIdCounter, setSessionIdCounter] = useState(0);

  // Should be called something like getLatestSessionId and be in hook?
  // Should get latest session id from db
  const getNextSessionId = () => {
    setSessionIdCounter((prevId) => prevId + 1);
    return sessionIdCounter;
  };

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

  const videoGameDropdown2 = (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="w-40 rounded-sm border p-2">
          {selectedGame ? selectedGame.gameName : "Select Game"}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="flex min-w-52 flex-col rounded-lg p-1.5 shadow-lg shadow-black transition duration-500 ease-in-out">
        {testGames.map((game, index) => (
          <DropdownMenu.Item
            key={index}
            className="w-full cursor-pointer rounded-lg p-2 text-center hover:bg-gray-600"
            onSelect={() => setSelectedGame(game)}
          >
            {game.gameName}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
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
        onClick={createSession}
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

              {videoGameDropdown2}
            </div>
            {/* Players */}
            <PlayerSelector
              rdcMembers={rdcMembers}
              selectedPlayers={selectedPlayers}
              setSelectedPlayers={setSelectedPlayers}
            />
          </div>
          {/* Set Info */}
          {session.sets &&
            session.sets.map((set: EnrichedGameSet, setId: number) => (
              <div
                className="m-2 flex flex-col justify-start"
                id={`session-${session.sessionId}-set-${setId}-info`}
                key={setId}
              >
                {/* Set Id Container*/}
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center">
                    <p className="m-2 text-lg">Set {setId}</p>
                    <input
                      type="text"
                      placeholder="setId"
                      className="w-16 border p-2"
                    />
                  </div>
                  <button
                    className="mr-0 w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
                    onClick={() => addMatchToSet(setId)}
                  >
                    {" "}
                    Add match to Set {setId}
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
            onClick={() => addSetToSession(getNextSessionId())}
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
