import { Player } from "@prisma/client";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import PlayerSessionManager from "./PlayerSessionManager";
import PlayerSelector from "./PlayerSelector";
import { Button } from "@/components/ui/button";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import RDCVisionModal from "./RDCVisionModal";
import { VisionPlayer, VisionResults } from "@/app/actions/visionAction";
import {
  FormValues,
  MatchWinners,
  PlayerSessions,
} from "../../_utils/form-helpers";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";

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
      playerSessionName: player.playerName, // Discrepancy in what is being assigned to playerSessionName
      playerStats: [],
    }));
    console.log("Player Sessions: ", playerSessions);
    append({
      matchWinners: [] as unknown as MatchWinners,
      playerSessions: playerSessions as unknown as PlayerSessions,
    });
  };

  const processTeamPlayers = (teamPlayers: VisionPlayer[]) => {
    return teamPlayers.map((player) => {
      return {
        playerId: player?.playerId || 0,
        playerSessionName: player?.name || "Unknown Player",
        playerStats: [...player.stats],
      };
    });
  };

  /**
   * Processes vision analysis results to create match player sessions
   * @param visionResults - The results from vision analysis containing blue and orange team player information
   * @remarks
   * 1. Maps vision results for both blue and orange teams into player sessions
   * 2. Finds existing players by gamer tag
   * 3. Creates player session objects with player IDs and stats
   */
  const handleCreateMatchFromVision = (visionResults: VisionResults) => {
    console.log("Handling Create Match from Vision: ", visionResults);

    const blueTeamPlayerSessions = processTeamPlayers(visionResults.blueTeam);

    const orangeTeamPlayerSessions = processTeamPlayers(
      visionResults.orangeTeam,
    );

    const visionMatchPlayerSessions = [
      ...blueTeamPlayerSessions,
      ...orangeTeamPlayerSessions,
    ];

    const visionWinners = visionResults.winner
      ?.map((player: VisionPlayer) => {
        return {
          playerId: player?.playerId,
          playerName: player?.name,
        };
      })
      .filter(
        (winner): winner is { playerId: number; playerName: string } =>
          winner.playerId !== undefined && winner.playerName !== undefined,
      );
    if (visionWinners && visionWinners.length > 0) {
      console.log("Setting Vision Winners!", visionWinners);
      append({
        matchWinners: visionWinners as MatchWinners, // Enforce non empty array
        playerSessions: visionMatchPlayerSessions as PlayerSessions,
      });
    } else {
      append({
        matchWinners: [] as unknown as MatchWinners, // Enforce non empty array,
        playerSessions: visionMatchPlayerSessions as PlayerSessions,
      });
    }
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
              <FormField
                name={`sets.${setIndex}.matches.${matchIndex}.matchWinners`}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <PlayerSelector
                      rdcMembers={players}
                      control={control}
                      field={field}
                      currentSelectedPlayers={field.value}
                      label="Match Winners"
                    />
                    <FormMessage />
                  </FormItem>
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
          sessionPlayers={players}
        />
      </div>
    </div>
  );
};

export default MatchManager;
