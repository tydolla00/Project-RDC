import { H1 } from "@/components/headings";
import { Submission } from "./_components/data-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getRDCMembers } from "../../../../prisma/lib/admin";
import EntryCreatorForm from "./_components/EntryCreatorForm";

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

  return (
    <div className="m-16">
      <H1>Admin</H1>

      <Suspense fallback={<Skelly />}>
        <EntryCreatorForm rdcMembers={await getRDCMembers()} />
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
