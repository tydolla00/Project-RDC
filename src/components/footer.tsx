import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="relative bottom-0">
      <div className="ml-10 flex min-h-60 gap-16 p-4">
        <div>
          <div className="mb-2 underline">Home</div>
        </div>
        <div>
          <div className="mb-2 underline">About</div>
        </div>
        <div className="flex flex-col">
          <div className="mb-2 underline">Games</div>
          <Link
            className="text-muted-foreground hover:text-chart-4"
            href="/games/rocketleague"
          >
            Rocket League
          </Link>
          <Link
            className="text-muted-foreground hover:text-chart-4"
            href="/games/callofduty"
          >
            Call of Duty
          </Link>
          <Link
            className="text-muted-foreground hover:text-chart-4"
            href="/games/lethalcompany"
          >
            Lethal Company
          </Link>
          <Link
            className="text-muted-foreground hover:text-chart-4"
            href="/games/speedrunners"
          >
            SpeedRunners
          </Link>
          <Link
            className="text-muted-foreground hover:text-chart-4"
            href="/games/mariokart"
          >
            MarioKart
          </Link>
        </div>
      </div>
    </footer>
  );
};
