import { Suspense } from "react";
import { SubmissionTable } from "../../_components/SubmissionTable";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full" />}>
      <SubmissionTable page={resolvedSearchParams.page} />
    </Suspense>
  );
}
