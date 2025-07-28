import { useFormContext } from "react-hook-form";
import { H2 } from "@/components/headings";
import { FormValues } from "../../_utils/form-helpers";
import PlayerAvatar from "./PlayerAvatar";

export const FormSummary = () => {
  const { getValues } = useFormContext<FormValues>();

  const sets = getValues("sets");

  return (
    <>
      <H2>Form Summary</H2>
      <div className="grid grid-cols-2 gap-2 divide-x divide-gray-400">
        {sets.map((set, index) => (
          <div className="border-b" key={set.setId}>
            <div>Set {index + 1} Winners</div>
            <div className="my-2 flex">
              {set.setWinners.map((winner) => (
                <PlayerAvatar key={winner.playerId} player={winner} />
              ))}
            </div>
            {set.matches.map((match, matchIndex) => (
              <div key={matchIndex}>
                <div>Match {matchIndex + 1} Winners</div>
                <div className="my-2 flex">
                  {match.matchWinners.map((winner) => (
                    <PlayerAvatar key={winner.playerId} player={winner} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
