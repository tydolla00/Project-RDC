import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { H2 } from "@/components/headings";
import { formSchema } from "../../_utils/form-helpers";

export const FormSummary = () => {
  const { watch, control, getValues } =
    useFormContext<z.infer<typeof formSchema>>();

  const sets = getValues("sets");

  return (
    <>
      <H2>Form Summary</H2>
      {sets.map((set, index) => (
        <div key={set.setId}>
          <div className="flex">
            <div>Set {index + 1} winners &nbsp;</div>
            {set.setWinners.map((winner) => (
              <div key={winner.playerId}>{winner.playerName} &nbsp;</div>
            ))}
          </div>
          {set.matches.map((match, matchIndex) => (
            <div key={matchIndex} className="flex">
              <div>Match {matchIndex + 1} winners &nbsp;</div>
              {match.matchWinners.map((winner) => (
                <div key={winner.playerId}>{winner.playerName} &nbsp;</div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
