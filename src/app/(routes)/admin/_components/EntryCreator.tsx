"use client";
import React, { useEffect } from "react";
import PlayerSelector from "./PlayerSelector";
import { Match, Player } from "@prisma/client";
import { EnrichedGameSet } from "../../../../../prisma/types/gameSet";
import useAdminFormCreator from "@/lib/hooks/useAdminFormCreator";
import MatchForm from "./MatchForm";
import * as Separator from "@radix-ui/react-separator";
import AdminGameDropDown from "./AdminGameDropDown";
import { useSearchParams } from "next/navigation";
import GameSetForm from "./GameSetForm";

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
    getNextTempSessionId,
    setSessionPlayers,
  } = useAdminFormCreator();

  const searchParams = useSearchParams();

  const selectedPlayerIds = searchParams
    .getAll("selectedPlayers")
    .join(",")
    .split(",");

  const getSelectedPlayers = (
    selectedPlayerIds: string[],
    rdcMembers: Player[],
  ) => {
    return rdcMembers.filter((player) =>
      selectedPlayerIds.includes(player.playerId.toString()),
    );
  };

  const selectedPlayers: Player[] = React.useMemo(
    () => getSelectedPlayers(selectedPlayerIds, rdcMembers),
    [selectedPlayerIds, rdcMembers],
  );

  // // TODO: THis doesn't work!
  // useEffect(() => {
  //   setSessionPlayers(selectedPlayers);
  // }, []);

  // LOGGING
  selectedPlayers.forEach((player) => {
    console.log(
      `Selected Players: ${selectedPlayers
        .map((player) => `${player.playerId}:${player.playerName}`)
        .join(" ")}`,
    );
  });

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold underline">Entry Creator</h2>
      <p className="text-md m-2">
        This is where the admins of the site will create all entries to be
        submitted to the database.{" "}
      </p>
      <button
        className="w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
        onClick={() => createSession(getNextTempSessionId())}
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

              <AdminGameDropDown />
            </div>
            {/* Player Selector */}
            <div className="flex flex-col items-center">
              <label className="">Player Selector </label>

              <PlayerSelector rdcMembers={rdcMembers} />
            </div>
          </div>
          {/* Set Info */}
          {session.sets &&
            session.sets.map((set: EnrichedGameSet) => (
              <GameSetForm
                key={set.setId}
                set={set}
                setPlayers={selectedPlayers}
                addMatchToSet={addMatchToSet}
              />
              // <div
              //   className="m-2 flex flex-col justify-start"
              //   id={`session-${session.sessionId}-set-${set.setId}-info`}
              //   key={set.setId}
              // >
              //   {/* Set Id Container*/}
              //   <div className="flex items-center justify-between p-2">
              //     <div className="flex items-center">
              //       <p className="m-2 text-lg">Set {set.setId}</p>
              //       <input
              //         type="text"
              //         placeholder="setId"
              //         className="w-16 border p-2"
              //       />
              //     </div>
              //     <button
              //       className="mr-0 w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
              //       onClick={() => addMatchToSet(set.setId)}
              //     >
              //       {" "}
              //       Add match to Set {set.setId}
              //     </button>
              //   </div>
              //   <Separator.Root className="m-2 h-[1px] w-full bg-slate-800"></Separator.Root>

              //   {set.matches &&
              //     set.matches.map((match: Match) => (
              //       <MatchForm
              //         key={match.matchId}
              //         matchPlayers={selectedPlayers}
              //       ></MatchForm>
              //     ))}

              //   {/* Set Winner */}
              //   <div className="flex flex-col items-center">
              //     <p className="text-2xl">Set Winner</p>
              //     <PlayerSelector rdcMembers={selectedPlayers} />
              //   </div>
              // </div>
            ))}
          {/* Set Btn */}
          <button
            className="m-2 w-56 rounded-sm border border-white p-2 hover:bg-gray-600"
            onClick={async () => addSetToSession(session.sessionId)}
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
