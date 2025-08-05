import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QueryResponseData } from "prisma/db";
import { getAllSessionsByGame } from "prisma/lib/admin";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { analyzeMvp, MvpOutput } from "@/app/ai/actions";
import { getSetsData, ProcessedRLSet } from "./match-data";
import { capitalizeFirst } from "@/lib/utils";
// import { readStreamableValue } from "@ai-sdk/rsc";

type Sessions = QueryResponseData<
  Awaited<ReturnType<typeof getAllSessionsByGame>>
>;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const MVP = ({ session }: { session: Sessions[0] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mvp, setMvp] = useState<MvpOutput | null>(null);
  // const [generation, setGeneration] = useState<string | null>(null);

  return (
    <Card className="relative overflow-hidden">
      <div className="from-primary/10 absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l to-transparent" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">MVP</CardTitle>
        <CardDescription>Match Statistics</CardDescription>
        <Button
          className="cursor-pointer"
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true);
            try {
              const stats = getSetsData(session);
              console.log({ stats });
              // const { object } = await analyzeMvp(stats as ProcessedRLSet[]);
              // for await (const partialObject of readStreamableValue(object)) {
              //   if (partialObject) {
              //     console.log(partialObject);
              //     setGeneration(
              //       JSON.stringify(partialObject.notifications, null, 2),
              //     );
              //   }
              // }
              const mvp = await analyzeMvp(stats as ProcessedRLSet[]);
              setMvp(mvp);
            } catch (error) {
              console.log("Unexpected error", error);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          Generate Description
        </Button>
        {isSubmitting && (
          <p className="text-muted-foreground text-sm">Generating...</p>
        )}
        {/* {generation && (
          <pre className="bg-muted mt-2 rounded-md p-4 text-sm">
            {generation}
          </pre>
        )} */}
      </CardHeader>
      <CardContent>
        {mvp ? (
          <div className="relative space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="border-primary/20 h-16 w-16 border-2">
                <AvatarImage
                  src={`/images/${mvp.player.toLowerCase()}_rdc.jpg`}
                  alt={mvp.player}
                />
                <AvatarFallback>{mvp.player[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{mvp.player}</h3>
                <p className="text-muted-foreground text-sm">
                  {mvp.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {mvp.stats.map((stat) => (
                <div
                  key={stat.statName}
                  className="bg-muted space-y-1 rounded-lg p-3"
                >
                  <p className="text-sm font-medium">
                    {capitalizeFirst(stat.statName)}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.sum}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {stat.average} per game
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No data available for this player in this session.</p>
        )}
      </CardContent>
    </Card>
  );
};
