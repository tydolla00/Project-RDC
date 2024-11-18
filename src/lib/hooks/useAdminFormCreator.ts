import { useState } from "react";
import { EnrichedSession } from "../../../prisma/types/session";
import { EnrichedGameSet } from "../../../prisma/types/gameSet";
import { EnrichedMatch } from "../../../prisma/types/match";

const useAdminFormCreator = () => {
  const [session, setSession] = useState<EnrichedSession>({
    sessionId: 0,
    sessionName: "",
    sessionUrl: "",
    gameId: 0,
    date: new Date(),
    sets: [],
    thumbnail: "",
  });

  const [sessionIdCounter, setSessionIdCounter] = useState(1);
  const [setIdCounter, setSetIdCounter] = useState(1);
  const [matchIdCounter, setMatchIdCounter] = useState(1);
  const [playerSessionCounter, setPlayerSessionCounter] = useState(1);
  const [playerStatCounter, setPlayerStatCounter] = useState(1);

  const [isInCreationFlow, setIsInCreationFlow] = useState(false);

  const createSession = (sessionId: number) => {
    console.log("Creating Session");
    setSession({
      sessionId: sessionId,
      sessionName: "",
      sessionUrl: "",
      gameId: 0,
      date: new Date(),
      sets: [],
      thumbnail: "",
    });
    setIsInCreationFlow(true);
  };

  const addSetToSession = (sessionId: number) => {
    console.log("Creating Set");
    const newSet: EnrichedGameSet = {
      setId: getNextTempSetId(),
      sessionId: sessionId,
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
      matchId: getNextTempMatchId(),
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

  const getNextTempSessionId = () => {
    setSessionIdCounter((prev) => prev + 1);
    return sessionIdCounter;
  };

  const getNextTempSetId = () => {
    setSetIdCounter((prev) => prev + 1);
    return setIdCounter;
  };

  const getNextTempMatchId = () => {
    setMatchIdCounter((prev) => prev + 1);
    return matchIdCounter;
  };

  const getNextTempPlayerSessionId = () => {
    setPlayerSessionCounter((prev) => prev + 1);
    return playerSessionCounter;
  };

  const getNextTempPlayerStatId = () => {
    setPlayerStatCounter((prev) => prev + 1);
    return playerStatCounter;
  };

  return {
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
  };
};

export default useAdminFormCreator;
