import React from "react";
import { EnrichedSession } from "../../../../../prisma/types/session";

const EntryCreator = () => {
  const sessions = [];

  // Create a session
  // Create match
  const createSession = () => {
    console.log("Creating Session");
  };
  return (
    <div>
      <p>This is where the admins of the site will create all entries. </p>
      <button className="rounded-sm border border-white p-2 hover:bg-gray-600">
        <p>Create Session</p>
        {/* Q: How are we going to get the next session id?  */}
        {}
      </button>
    </div>
  );
};

export default EntryCreator;
