import { Player } from "@prisma/client";
import React, { useMemo } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import PlayerSessionManager from "./PlayerSessionManager";
import PlayerSelector from "./PlayerSelector";
import { Button } from "@/components/ui/button";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import {
  findPlayerByGamerTag,
  FormValues,
  PLAYER_MAPPINGS,
} from "../_utils/form-helpers";
import RDCVisionModal from "./RDCVisionModal";
import {
  VisionPlayer,
  VisionResults,
  VisionStat,
} from "@/app/actions/visionAction";

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

  /**
   * Handles the creation of a new match by creating player sessions from the available players.
   * Maps each player to a new player session object containing their ID, name, and empty stats array.
   * Appends the new match data with empty winners array and created player sessions to the form.
   *
   * @returns {void}
   *
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

  /**
   * Processes vision analysis results to create match player sessions
   * @param visionResults - The results from vision analysis containing blue and orange team player information
   * @remarks
   * This function:
   * 1. Maps vision results for both blue and orange teams into player sessions
   * 2. Finds existing players by gamer tag
   * 3. Creates player session objects with player IDs and stats
   * 4. Combines both teams' sessions and appends them to match data
   *
   * @param visionResults - Object containing:
   * - blueTeam: Array of VisionPlayer objects
   * - orangeTeam: Array of VisionPlayer objects
   *
   * Each VisionPlayer contains:
   * - name: string (gamer tag)
   * - stats: Array of player statistics
   */
  const handleCreateMatchFromVision = (visionResults: VisionResults) => {
    console.log("Handling Create Match from Vision: ", visionResults);

    const blueTeamPlayerSessions = visionResults.blueTeam.map(
      (player: VisionPlayer) => {
        const foundPlayer: Player = findPlayerByGamerTag(player.name);
        return {
          playerId: foundPlayer?.playerId || 0,
          playerSessionName: foundPlayer.playerName,
          playerStats: [...player.stats],
        };
      },
    );

    const orangeTeamPlayerSessions = visionResults.orangeTeam.map(
      (player: VisionPlayer) => {
        const foundPlayer = findPlayerByGamerTag(player.name);
        return {
          playerId: foundPlayer?.playerId || 0,
          playerSessionName: player.name,
          playerStats: [...player.stats],
        };
      },
    );

    console.log("Orange Team Player Sessions: ", orangeTeamPlayerSessions);
    console.log("Blue Team Player Sessions: ", blueTeamPlayerSessions);

    const visionMatchPlayerSessions = [
      ...blueTeamPlayerSessions,
      ...orangeTeamPlayerSessions,
    ];

    append({
      matchWinners: [],
      playerSessions: visionMatchPlayerSessions,
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
              <PlayerSessionManager
                setIndex={setIndex}
                matchIndex={matchIndex}
                players={players}
              />
            </div>
          );
        })}
      <div className="flex justify-between">
        <Button
          className="my-2 rounded-md bg-purple-900 p-2 font-semibold text-white hover:bg-purple-950"
          type="button"
          onClick={handleNewMatchClick}
        >
          Add Match
        </Button>
        <RDCVisionModal
          handleCreateMatchFromVision={handleCreateMatchFromVision}
        />
      </div>
    </div>
  );
};

export default MatchManager;
