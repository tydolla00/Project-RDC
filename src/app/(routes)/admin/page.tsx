import { H1 } from "@/components/headings";
import { SubmissionForm } from "../submission/_components/form";
import { columns, DataTable, Submission } from "./_components/data-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getLatestMarioKart8Session } from "../../../../prisma/lib/marioKart";
import { EnrichedSession } from "../../../../prisma/types/session";
import EntryCreator from "./_components/EntryCreator";
import { getRDCMembers } from "../../../../prisma/lib/admin";
import prisma from "../../../../prisma/db";
import { Session } from "@prisma/client";

const getData = () => {
  const data: Submission[] = [
    {
      member: "Leland",
      stat: "Sorriest Gamer",
      url: "https://www.youtube.com/watch?v=bP5LpMf9gaQ",
      val: "1",
    },
    {
      member: "Mark",
      stat: "Sorriest Gamer",
      url: "https://www.youtube.com/watch?v=bP5LpMf9gaQ",
      val: "2",
    },
  ];
  return new Promise<Submission[]>((resolve, reject) => {
    resolve(data);
  });
};

export default async function Page() {
  const data: Submission[] = await getData();

  const getLatestMK8Function: EnrichedSession | undefined =
    await getLatestMarioKart8Session();

  if (getLatestMK8Function) {
    console.log(getLatestMK8Function);
    console.log(getLatestMK8Function.sets);
  }

  const allSessions: Session[] = await prisma.session.findMany();
  console.log(`All Sessions: ${allSessions}`);
  return (
    <div className="m-16">
      <H1>Admin</H1>

      <Suspense fallback={<Skelly />}>
        {/* <DataTable columns={columns} data={[]} /> */}
        <EntryCreator rdcMembers={await getRDCMembers()} />
      </Suspense>
    </div>
  );
}

const Skelly = () => {
  return (
    <div>
      <Skeleton className="mb-4 h-9 w-1/4" />
      <Skeleton className="h-10 w-full border-b" />
      <Skeleton className="h-10 w-full border-b" />
      <Skeleton className="h-10 w-full border-b" />
    </div>
  );
};
