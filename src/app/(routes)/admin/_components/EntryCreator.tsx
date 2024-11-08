"use client";
import React, { useState } from "react";
import { EnrichedSession } from "../../../../../prisma/types/session";

const EntryCreator = () => {
  const [sessions, setSession] = useState<any[]>([]);

  // Create a session
  // Create match
  const createSession = () => {
    console.log("Creating Session");
    const newSession = {};
    setSession([...sessions, newSession]);
  };

  return (
    <div>
      <p>This is where the admins of the site will create all entries. </p>
      <button
        className="rounded-sm border border-white p-2 hover:bg-gray-600"
        onClick={createSession}
      >
        <p>Create Session</p>
        {/* Q: How are we going to get the next session id?  */}
      </button>
      {sessions.map((session: any, index: number) => (
        <div key={index}>
          <p>Session {index + 1}</p>
          <input type="text" placeholder="URL" className="m-2 border p-2" />
          <input
            type="text"
            placeholder="Video Name"
            className="m-2 border p-2"
          />
          <select className="m-2 border p-2">
            <option value="" disabled>
              Select Video Game
            </option>
            <option value="game1">Game 1</option>
            <option value="game2">Game 2</option>
            <option value="game3">Game 3</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default EntryCreator;
