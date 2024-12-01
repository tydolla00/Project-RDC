import React from "react";
import { set, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./EntryCreatorForm";

interface Props {
  setIndex: number;
}

const WinnerDisplay = (props: Props) => {
  const { setIndex } = props;
  const { watch } = useFormContext<z.infer<typeof formSchema>>();
  const winners = watch(`sets.${setIndex}.setWinners`);
  return (
    <div id={`set.${setIndex}-set-winner-container`} className="text-center">
      <h6 className="mb-2 text-base"> Set Winner </h6>

      {winners.length > 0 ? (
        <div>
          {winners.map((player) => {
            return <div key={player.playerId}>{player.playerName}</div>;
          })}
        </div>
      ) : (
        <p className="text-sm text-red-400"> No set winners selected </p>
      )}
    </div>
  );
};

export default WinnerDisplay;