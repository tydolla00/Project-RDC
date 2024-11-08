"use client";
import React, { useEffect, useState } from "react";
import PlayerSelector from "./PlayerSelector";
import { getRDCMembers } from "../../../../../prisma/lib/admin";
import { Player } from "@prisma/client";

interface Props {
  rdcMembers: Player[];
}

const EntryCreator = ({ rdcMembers }: Props) => {
  const [sessions, setSession] = useState<any[]>([]);
  const [matches, setMatch] = useState<any[]>([]);

  // Create a session
  // Create match
  const createSession = () => {
    console.log("Creating Session");
    const newSession = {};
    setSession([...sessions, newSession]);
  };

  const addMatchToSession = (sessionIndex: number) => {
    console.log(`Creating Match for Session ${sessionIndex + 1}`);
    const newMatch = {};
    const updatedSessions = sessions.map((session, index) => {
      if (index === sessionIndex) {
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
      {sessions.map((session: any, index: number) => (
        <div
          className="flex flex-col"
          id={`session-${index}-container`}
          key={index}
        >
          <p>Session {index + 1}</p>
          {/* Session Info */}
          <div
            className="flex flex-row justify-around"
            id={`session-${index}-info`}
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
              <option value="game1">Game 1</option>
              <option value="game2">Game 2</option>
              <option value="game3">Game 3</option>
            </select>

            {/* Players */}
            <PlayerSelector rdcMembers={rdcMembers} />
          </div>
          {/* Match Info */}
          {session.matches &&
            session.matches.map((match: any, matchIndex: number) => (
              <div
                className="flex flex-row justify-around"
                id={`session-${index}-match-${matchIndex}-info`}
                key={matchIndex}
              >
                {/* URL */}
                <input
                  type="text"
                  placeholder="matchId"
                  className="w-80 border p-2"
                />
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
                  <option value="game1">Game 1</option>
                  <option value="game2">Game 2</option>
                  <option value="game3">Game 3</option>
                </select>
              </div>
            ))}
          {/* Match Btn */}
          <button
            className="w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
            onClick={() => addMatchToSession(index)}
          >
            {" "}
            Create Match
          </button>
        </div>
      ))}
    </div>
  );
};

export default EntryCreator;
