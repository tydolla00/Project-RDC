"use client";
import { useState } from "react";
import { EnrichedSession } from "../../prisma/types/session";
import { EnrichedGameSet } from "../../prisma/types/gameSet";
import { EnrichedMatch } from "../../prisma/types/match";
import { Player } from "@prisma/client";
import { EnrichedPlayerSession } from "../../prisma/types/playerSession";

/**
 * Custom hook for managing admin form state and operations
 *
 * @description
 * This hook provides:
 * 1. Session state management and counter generation
 * 2. Methods for adding/updating sets, matches, and player sessions
 * 3. Player session creation with automatic ID generation
 * 4. Match winner handling and validation
 * 5. Set state management with proper session association
 *
 * The hook maintains internal counters for generating temporary IDs until
 * the data is persisted to the database. These IDs are used to maintain
 * relationships between entities during form editing.
 *
 * @returns An object containing:
 * - session state and modifiers
 * - methods for managing sets, matches and player sessions
 * - counter states for ID generation
 */
const useAdminFormCreator = () => {
  const [session, setSession] = useState<
    Omit<
      EnrichedSession,
      "createdAt" | "updatedAt" | "createdBy" | "Game" | "isApproved"
    >
  >({
    sessionId: 0,
    sessionName: "",
    sessionUrl: "",
    gameId: 0,
    date: new Date(),
    sets: [],
    thumbnail: "",
    videoId: "",
  });

  const [sessionIdCounter, setSessionIdCounter] = useState(1);
  const [sessionPlayers, setSessionPlayers] = useState<Player[]>([]);
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
      videoId: "",
    });
    setIsInCreationFlow(true);
  };

  const addSetToSession = (sessionId: number) => {
    console.log("Creating Set");
    const newSet: Omit<EnrichedGameSet, "createdAt" | "updatedAt"> = {
      setId: getNextTempSetId(),
      sessionId: sessionId,
      matches: [],
    };

    setSession((prevSession) => {
      const updatedSets = [...prevSession.sets, newSet] as (typeof newSet)[];
      return { ...prevSession, sets: updatedSets } as unknown as typeof session;
    });
  };

  console.log("Session: ", session);

  const addMatchToSet = (setId: number) => {
    console.log(`Creating Match for ${setId}`);
    // TODO: Add match winner
    const matchId = getNextTempMatchId();
    const newMatch: Omit<EnrichedMatch, "createdAt" | "updatedAt"> = {
      matchId: matchId,
      setId: setId,
      date: new Date(),
      playerSessions: [],
      // Need to populate playerSessions here
    };

    for (let i = 0; i < sessionPlayers.length; i++) {
      const playerSessionIdOffset = (matchId - 1) * sessionPlayers.length;
      const adjustedPlayerSessionId = i + 1 + playerSessionIdOffset; // This is a hacky way to get the playerSessionId need to rework across the board
      // TODO temp bc of prisma bs
      const newPlayerSession = addPlayerSessionToMatch(
        matchId,
        setId,
        sessionPlayers[i],
        adjustedPlayerSessionId,
      ) as unknown;
      newMatch.playerSessions.push(newPlayerSession as EnrichedPlayerSession);
    }

    console.log("New Match: ", newMatch);

    setSession((prevSession) => {
      const updatedSets = prevSession.sets.map((set) => {
        console.log("Set ID: ", set.setId);
        if (set.setId === setId) {
          return { ...set, matches: [...set.matches, newMatch] };
        }
        return set;
      });

      console.log("Updated Sets: ", updatedSets);

      return { ...prevSession, sets: updatedSets } as typeof session;
    });
  };

  const updateSetWinners = (setId: number) => {
    // Should take in a set ID and update the winner array
  };

  /* Whenever a match is created we need to add playerSessions
   *based on the selected players and populate playerSession with appropriate stats based on game
   */

  //  TODO Use prisma types
  const addPlayerSessionToMatch = (
    matchId: number,
    setId: number,
    player: Player,
    playerSessionId: number,
  ) => {
    const match = {
      date: new Date(),
      setId: setId,
      matchId: matchId,
    } as EnrichedPlayerSession["match"];
    return {
      sessionId: session.sessionId,
      setId: setId, // TODO: ????
      playerSessionId: playerSessionId,
      matchId: matchId,
      playerId: player.playerId,
      playerStats: [],
      match,
      player: {
        playerId: player.playerId,
        playerName: player.playerName,
      },
    };
  };

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
    setSessionPlayers,
  };
};

export default useAdminFormCreator;
