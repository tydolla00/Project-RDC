const GolfWithFriends = ({
  game,
}: {
  game: { gameId: number; gameName: string };
}) => {
  return <div>{game.gameName}</div>;
};
export default GolfWithFriends;
