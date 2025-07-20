import { H1 } from "@/components/headings";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllMembers } from "../../../../prisma/lib/members";
import EntryCreatorForm from "./_components/form/EntryCreatorForm";
import { MotionConfig } from "motion/react";
import { NoMembers } from "../(groups)/members/_components/members";

export default async function Page() {
  const members = await getAllMembers();
  if (!members.success || !members.data || members.data.length === 0)
    return <NoMembers />;
  return (
    <div>
      <H1>Admin</H1>
      <Suspense fallback={<Skelly />}>
        <MotionConfig transition={{ duration: 0.6, type: "spring", bounce: 0 }}>
          <EntryCreatorForm rdcMembers={members.data} />
        </MotionConfig>
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
