import { H1 } from "@/components/headings";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllMembers } from "../../../../prisma/lib/members";
import EntryCreatorForm from "./_components/form/EntryCreatorForm";
import { MotionConfig } from "motion/react";

export default async function Page() {
  return (
    <div>
      <H1>Admin</H1>
      <Suspense fallback={<Skelly />}>
        <MotionConfig transition={{ duration: 0.6, type: "spring", bounce: 0 }}>
          <EntryCreatorForm rdcMembers={await getAllMembers()} />
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
