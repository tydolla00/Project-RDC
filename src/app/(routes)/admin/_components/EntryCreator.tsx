"use client";
import React, { useEffect, useState } from "react";
import PlayerSelector from "./PlayerSelector";
import { getRDCMembers } from "../../../../../prisma/lib/admin";
import { GameSet, Match, Player, Session } from "@prisma/client";
import { EnrichedSession } from "../../../../../prisma/types/session";
import { EnrichedGameSet } from "../../../../../prisma/types/gameSet";

interface Props {
  rdcMembers: Player[];
}

const EntryCreator = ({ rdcMembers }: Props) => {
  const [sessions, setSession] = useState<any[]>([]);
  const [matches, setMatch] = useState<any[]>([]);

  const [selectedPlayers, setSelectedPlayers] = useState<number[] | null>(null);

  /**
   * Click start new session -- > getLatestSessionId + 1
   * populate sessionObject and assign Id, then create session form
   * Custom Hook?
   */

  // Create a session
  const createSession = () => {
    console.log("Creating Session");
    const newSession: EnrichedSession = {
      sessionId: 0,
      sessionName: "",
      sessionUrl: "",
      gameId: 0,
      date: new Date(),
      sets: [],
    };
    setSession([...sessions, newSession]);
  };

  const addSetToSession = (sessionIndex: number) => {
    console.log("Creating Set");
    const newSet: GameSet = {
      setId: 0,
      sessionId: 0,
    };

    const updatedSessions = sessions.map((session, index) => {
      if (index === sessionIndex) {
        return {
          ...session,
          sets: [...(session.sets || []), newSet],
        };
      }
      return session;
    });
    setSession(updatedSessions);
  };

  // Create match
  const addMatchToSet = (setId: number) => {
    console.log(`Creating Match for Set ${setId}`);
    const newMatch = {};
    const updatedSessions = sessions.map((session, index) => {
      if (index === setId) {
        return {
          ...session,
          matches: [...(session.matches || []), newMatch],
        };
      }
      return session;
    });
    setSession(updatedSessions);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-bold underline">Entry Creator</h2>
      <p>This is where the admins of the site will create all entries. </p>
      <button
        className="w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
        onClick={createSession}
      >
        <p>Create Session</p>
        {/* Q: How are we going to get the next session id?  */}
      </button>
      {sessions.map((session: EnrichedSession, sessionId: number) => (
        <div
          className="flex flex-col"
          id={`session-${sessionId}-container`}
          key={sessionId}
        >
          <p>Session {sessionId}</p>
          {/* Session Info */}
          <div
            className="flex flex-row justify-around"
            id={`session-${sessionId}-info`}
          >
            {/* URL */}
            <input type="text" placeholder="URL" className="w-80 border p-2" />
            {/* Video Name */}
            <input
              type="text"
              placeholder="Video Name"
              className="w-80 border p-2"
            />
            {/* Game Dropdown */}
            <select className="w-40 border p-2">
              <option value="" disabled>
                Select Video Game
              </option>
              {/* TODO: Get These Dynamically */}
              <option value="game1">Mario Kart</option>
              <option value="game2">Call of Duty</option>
              <option value="game3">Gang Beasts</option>
            </select>

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
                className="m-2 flex flex-row justify-start"
                id={`session-${sessionId}-set-${setId}-info`}
                key={setId}
              >
                {/* URL */}
                <input
                  type="text"
                  placeholder="setId"
                  className="w-80 border p-2"
                />
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
                    <div
                      className="flex flex-row justify-around"
                      id={`session-${sessionId}-set-${setId}-match-${matchId}-info`}
                      key={matchId}
                    >
                      {/* URL */}
                      <input
                        type="text"
                        placeholder="matchId"
                        className="w-80 border p-2"
                      />
                    </div>
                  ))}
              </div>
            ))}
          {/* Set Btn */}
          <button
            className="w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
            onClick={() => addSetToSession(sessionId)}
          >
            {" "}
            Start New Set
          </button>
        </div>
      ))}
    </div>
  );
};

export default EntryCreator;
