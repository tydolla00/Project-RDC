import { Card } from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import { Button } from "@/components/ui/button";
import MatchData from "../match-data";
import { MVP } from "../mvp";
import { MvpOutput, mvpStatsSchema } from "@/app/ai/types";
import Image from "next/image";
import { Sessions } from "./timeline-chart";

export const VideoInfo = ({
  session,
}: {
  session: Sessions[0] | undefined;
}) => {
  const mvp = useMemo<MvpOutput | null>(() => {
    if (session?.mvp) {
      const res = mvpStatsSchema.safeParse(session.mvpStats);
      return res.success
        ? ({
            description: session.mvpDescription,
            player: session.mvp.playerName,
            stats: session.mvpStats,
          } as MvpOutput)
        : null;
    } else return null;
  }, [session]);
  return (
    <Suspense fallback={<Skeleton className="h-[400px]" />}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {session ? (
          <>
            <div className="flex h-[400px] flex-col space-y-4">
              <Link
                target="_blank"
                rel="noreferrer noopener"
                href={session.sessionUrl}
                className="group block overflow-hidden rounded-lg"
              >
                <Image
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                  height={400}
                  width={600}
                  alt={session.sessionName}
                  src={session.thumbnail}
                />
                <div className="mt-4 font-medium group-hover:underline">
                  {session.sessionName}
                </div>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full flex-1">
                    Show Session Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-screen max-w-3xl">
                  <DialogHeader className="space-y-0">
                    <DialogTitle>Session Info</DialogTitle>
                    <DialogDescription>
                      Explore the info about this video
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[80vh]">
                    <MatchData session={session} />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            <MVP key={session.sessionId} session={session} defaultMvp={mvp} />
          </>
        ) : (
          <>
            <Card className="bg-muted/40 flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No session selected</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Hover over a point on the chart to see session details.
                </p>
              </div>
            </Card>

            <Card className="bg-muted/40 flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No MVP data</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  MVP data will appear here when a session is selected.
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    </Suspense>
  );
};
