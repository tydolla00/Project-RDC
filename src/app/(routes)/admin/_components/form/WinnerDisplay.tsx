import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormValues } from "../../_utils/form-helpers";

interface Props {
  setIndex: number;
}

const WinnerDisplay = (props: Props) => {
  const { setIndex } = props;
  const { control } = useFormContext<FormValues>();
  const winners = useWatch({ name: `sets.${setIndex}.setWinners`, control });
  return (
    <div
      id={`set.${setIndex}-set-winner-container`}
      className="self-start text-center"
    >
      <h6 className="mb-2 text-base"> Set Winner </h6>

      {winners.length > 0 ? (
        <>
          {winners.map((player) => {
            return (
              <div className="mx-2 inline-block w-fit" key={player.playerId}>
                {player.playerName}
              </div>
            );
          })}
        </>
      ) : (
        <p className="text-sm text-red-400"> No set winners selected </p>
      )}
    </div>
  );
};

export default WinnerDisplay;
