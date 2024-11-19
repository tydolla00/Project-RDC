"use client";

import React from "react";
import MatchForm from "./MatchForm";
import PlayerSelector from "./PlayerSelector";
import useAdminFormCreator from "@/lib/hooks/useAdminFormCreator";
import { EnrichedGameSet } from "../../../../../prisma/types/gameSet";
import { Match, Player } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

interface Props {
  set: EnrichedGameSet;
  setPlayers: Player[];
}

const GameSetForm = ({ set, setPlayers }: Props) => {
  const { addMatchToSet } = useAdminFormCreator();
  return (
    <div
      className="m-2 flex flex-col justify-start"
      id={`session-${set.sessionId}-set-${set.setId}-info`}
      key={set.setId}
    >
      {/* Set Id Container*/}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center">
          <p className="m-2 text-lg">Set {set.setId}</p>
          <input type="text" placeholder="setId" className="w-16 border p-2" />
        </div>
        <button
          className="mr-0 w-52 rounded-sm border border-white p-2 hover:bg-gray-600"
          onClick={() => addMatchToSet(set.setId)}
        >
          {" "}
          Add match to Set {set.setId}
        </button>
      </div>
      <Separator className="m-2 h-[1px] w-full bg-slate-800" />

      {/* Match might need to be custom type to give access to relations */}
      {set.matches &&
        set.matches.map((match: Match, matchId: number) => (
          <MatchForm key={matchId} matchPlayers={setPlayers}></MatchForm>
        ))}

      {/* Set Winner */}
      <div className="flex flex-col items-center">
        <p className="text-2xl">Set Winner</p>
        <PlayerSelector rdcMembers={setPlayers} />
      </div>
    </div>
  );
};

export default GameSetForm;
