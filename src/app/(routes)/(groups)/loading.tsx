import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-16">
      <div className="flex flex-wrap justify-center gap-10">
        <Skeleton className="h-64 w-64" />
        <Skeleton className="h-64 w-64" />
        <Skeleton className="h-64 w-64" />
        <Skeleton className="h-64 w-64" />
      </div>
      <div className="mt-10 flex gap-10">
        <Skeleton className="h-64 flex-1" />
        <Skeleton className="h-64 flex-1" />
      </div>
    </div>
  );
}
