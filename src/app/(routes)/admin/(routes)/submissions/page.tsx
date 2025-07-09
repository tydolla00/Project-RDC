import { Suspense } from "react";
import { SubmissionTable } from "../../_components/SubmissionTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full" />}>
      <SubmissionTable />
    </Suspense>
  );
}
