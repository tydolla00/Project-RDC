import { useState } from "react";
import { EnrichedSession } from "../../../prisma/types/session";
import { EnrichedGameSet } from "../../../prisma/types/gameSet";
import { Match } from "@prisma/client";
import { EnrichedMatch } from "../../../prisma/types/match";

const useAdminFormCreator = () => {
  const [session, setSession] = useState<EnrichedSession>({
    sessionId: 0,
    sessionName: "",
    sessionUrl: "",
    gameId: 0,
    date: new Date(),
    sets: [],
  });

  const [isInCreationFlow, setIsInCreationFlow] = useState(false);

  const createSession = () => {
    console.log("Creating Session");
    setSession({
      sessionId: 0,
      sessionName: "",
      sessionUrl: "",
      gameId: 0,
      date: new Date(),
      sets: [],
    });
    setIsInCreationFlow(true);
  };

  const addSetToSession = (setIndex: number) => {
    console.log("Creating Set");
    const newSet: EnrichedGameSet = {
      setId: setIndex,
      sessionId: 0,
      matches: [],
    };

    setSession((prevSession) => {
      const updatedSets = [...prevSession.sets, newSet];
      return { ...prevSession, sets: updatedSets };
    });
  };

  const addMatchToSet = (setId: number) => {
    console.log(`Creating Match for ${setId}`);
    // TODO: Add match winner
    const newMatch: EnrichedMatch = {
      matchId: 0,
      setId: setId,
      date: new Date(),
      playerSessions: [],
    };

    setSession((prevSession) => {
      const updatedSets = prevSession.sets.map((set) => {
        console.log("Set ID: ", set.setId);
        if (set.setId === setId) {
          return { ...set, matches: [...set.matches, newMatch] };
        }
        return set;
      });

      console.log("Updated Sets: ", updatedSets);

      return { ...prevSession, sets: updatedSets };
    });
  };

  const updateSetWiners = (setId: number) => {
    // Should take in a set ID and update the winner array
  };

  /* Whenever a match is created we need to add playerSessions
   *based on the selected players and populate playerSession with appropriate stats based on game
   */

  return {
    session,
    isInCreationFlow,
    createSession,
    addSetToSession,
    addMatchToSet,
  };
};

export default useAdminFormCreator;
