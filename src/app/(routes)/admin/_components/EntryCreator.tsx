"use client";
import React, { useState } from "react";
import PlayerSelector from "./PlayerSelector";
import { Match, Player } from "@prisma/client";
import { EnrichedGameSet } from "../../../../../prisma/types/gameSet";
import useAdminFormCreator from "@/lib/hooks/useAdminFormCreator";
import MatchForm from "../../submission/_components/MatchForm";
import * as Separator from "@radix-ui/react-separator";

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

  const [selectedPlayers, setSelectedPlayers] = useState<number[] | null>(null);

  const [sessionIdCounter, setSessionIdCounter] = useState(0);

  // Should be called something like getLatestSessionId and be in hook?
  // Should get latest session id from db
  const getNextSessionId = () => {
    setSessionIdCounter((prevId) => prevId + 1);
    return sessionIdCounter;
  };

  console.log("New Session", session);

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
              <select className="w-40 border p-2">
                <option value="" disabled>
                  Select Video Game
                </option>
                {/* TODO: Get These Dynamically */}
                <option value="game1">Mario Kart</option>
                <option value="game2">Call of Duty</option>
                <option value="game3">Gang Beasts</option>
              </select>
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
                <div className="flex items-center p-2">
                  <p className="m-2 text-lg">Set {setId}</p>
                  <input
                    type="text"
                    placeholder="setId"
                    className="w-80 border p-2"
                  />
                </div>
                <button
                  className="w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
                  onClick={() => addMatchToSet(setId)}
                >
                  {" "}
                  Add match to set {setId}
                </button>

                {/* Match might need to be custom type to give access to relations */}
                {set.matches &&
                  set.matches.map((match: Match, matchId: number) => (
                    <MatchForm
                      key={matchId}
                      players={selectedPlayers}
                    ></MatchForm>
                  ))}
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
