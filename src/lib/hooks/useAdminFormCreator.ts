"use client";
import { useState } from "react";
import { EnrichedSession } from "../../../prisma/types/session";
import { EnrichedGameSet } from "../../../prisma/types/gameSet";
import { EnrichedMatch } from "../../../prisma/types/match";
import { Player } from "@prisma/client";

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

  console.log("Session: ", session);

  const addMatchToSet = (setId: number) => {
    console.log(`Creating Match for ${setId}`);
    // TODO: Add match winner
    const matchId = getNextTempMatchId();
    const newMatch: EnrichedMatch = {
      matchId: matchId,
      setId: setId,
      date: new Date(),
      playerSessions: [],
      // Need to poulate playerSessions here
    };

    for (let i = 0; i < sessionPlayers.length; i++) {
      const playerSessionIdOffset = (matchId - 1) * sessionPlayers.length;
      const adjustedPlayerSessionId = i + 1 + playerSessionIdOffset; // This is a hacky way to get the playerSessionId need to rework across the board

      newMatch.playerSessions.push(
        addPlayerSessionToMatch(
          matchId,
          setId,
          sessionPlayers[i],
          adjustedPlayerSessionId,
        ),
      );
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

      return { ...prevSession, sets: updatedSets };
    });
  };

  const updateSetWinners = (setId: number) => {
    // Should take in a set ID and update the winner array
  };

  /* Whenever a match is created we need to add playerSessions
   *based on the selected players and populate playerSession with appropriate stats based on game
   */

  const addPlayerSessionToMatch = (
    matchId: number,
    setId: number,
    player: Player,
    playerSessionId: number,
  ) => {
    return {
      sessionId: session.sessionId,
      setId: setId, // TODO: ????
      playerSessionId: playerSessionId,
      matchId: matchId,
      playerId: player.playerId,
      playerStats: [],
      match: {
        date: new Date(),
        setId: setId,
        matchId: matchId,
      },
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
