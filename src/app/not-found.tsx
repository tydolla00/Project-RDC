import { H2 } from "@/components/headings";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const Loader = () => <Skeleton className="h-[315px] w-[560px]" />;
export default async function NotFound({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let msg =
    "Sorry we couldn't find the page you were looking for. While you're here, enjoy this video of Leland singing Cash Machine";

  const error = (await searchParams)?.error;
  if (error?.toString() === "AccessDenied")
    msg =
      "You're not permitted to sign in to this site just yet. Don't worry we're working on exciting features but in the meantime here's a rendition of Cash Machine by Leland.";
  return (
    <div className="mx-auto h-[95vh] w-fit">
      {!error && <H2>Page Not Found</H2>}
      <p className="my-6">{msg}</p>
      <Suspense fallback={<Loader />}>
        <iframe
          className="mx-auto"
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
    </div>
  );
}
