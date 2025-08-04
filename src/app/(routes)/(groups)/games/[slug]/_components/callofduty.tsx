const CallOfDuty = ({
  game,
}: {
  game: { gameId: number; gameName: string };
}) => {
  return <div>{game.gameName}</div>;
};
export default CallOfDuty;
