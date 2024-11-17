import { H2 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";

const Loader = () => <Skeleton className="h-[315px] w-[560px]" />;
export default async function NotFound() {
  return (
    <div className="mx-auto h-[95vh] w-fit">
      <H2>Page Not Found</H2>
      <p className="my-6">
        Sorry we couldn&apos;t find the page you were looking. While you&apos;re
        here enjoy this video of Leland singing Cash Machine
      </p>
      <Suspense fallback={<Loader />}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/ij2AxfZanRE?si=B3l9M6O1RjFTYyvE"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </Suspense>
      <Button className="my-10" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
