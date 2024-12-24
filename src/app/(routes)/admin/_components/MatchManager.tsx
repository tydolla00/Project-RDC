import { Player } from "@prisma/client";
import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import PlayerSessionManager from "./PlayerSessionManager";
import PlayerSelector from "./PlayerSelector";
import { FormValues } from "./EntryCreatorForm";
import { Button } from "@/components/ui/button";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";

interface Props {
  setIndex: number;
}

const MatchManager = (props: Props) => {
  const { control, getValues } = useFormContext<FormValues>();
  const { setIndex } = props;
  const { append, remove, fields } = useFieldArray({
    name: `sets.${setIndex}.matches`,
    control,
  });
  const players = getValues(`players`);

  const statName = "MK8_POS";

  /**
   *  Handles create new match button click.
   * Creates a new child Match under parent set
   */
  const handleNewMatchClick = () => {
    console.log("Handling New Match click", players);
    const playerSessions = players.map((player: Player) => ({
      playerId: player.playerId,
      playerSessionName: player.playerName,
      playerStats: [],
    }));
    console.log("Player Sessions: ", playerSessions);
    append({
      matchWinners: [],
      playerSessions: playerSessions,
    });
  };

  return (
    <div>
      {(fields.length === 0 && (
        <div className="text-center text-gray-500">
          No Matches! Click Add Match to start!
        </div>
      )) ||
        fields.map((match, matchIndex) => {
          return (
            <div key={match.id} className="my-5 flex flex-col justify-between">
              <div id="match-manager-header" className="flex justify-between">
                <Label>Match {matchIndex + 1}</Label>
                <Button
                  className="bg-red-500 text-xs text-white hover:bg-red-400"
                  type="button"
                  onClick={() => remove(matchIndex)}
                >
                  <MinusCircledIcon /> Remove Match
                </Button>
              </div>
              <Label className="my-2 text-muted-foreground">Match Winner</Label>
              <Controller
                name={`sets.${setIndex}.matches.${matchIndex}.matchWinners`}
                control={control}
                render={({ field }) => (
                  <PlayerSelector
                    rdcMembers={players}
                    control={control}
                    field={field}
                  />
                )}
              />
              <div className="my-4 text-center text-lg">
                Player Sessions for Match {matchIndex + 1}
              </div>
              {/* TODO Potentially move StatName here. Don't need to specify it for each control. */}
              <PlayerSessionManager
                statName={statName}
                setIndex={setIndex}
                matchIndex={matchIndex}
                players={players}
              />
              {/* <Separator className="my-4 h-px bg-slate-400" /> */}
            </div>
          );
        })}
      <div>
        <Button
          className="my-2 rounded-md bg-purple-900 p-2 font-semibold text-white hover:bg-purple-950"
          type="button"
          onClick={handleNewMatchClick}
        >
          Add Match
        </Button>
      </div>
    </div>
  );
};

export default MatchManager;
