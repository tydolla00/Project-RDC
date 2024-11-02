import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="m-10">
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
