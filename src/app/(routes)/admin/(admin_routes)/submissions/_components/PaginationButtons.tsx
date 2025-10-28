"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "next/navigation";

export const PaginationButtons = ({
  count,
  page,
  pageSize = 20,
}: {
  count: number;
  page: number;
  pageSize?: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage.toString());
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const totalPages = Math.ceil(count / pageSize);
  const getPageNumbers = () => {
    const numbers: (number | string)[] = [];

    // Always add page 1
    numbers.push(1);

    // Add ellipsis if there's a gap after 1
    if (page > 3) {
      numbers.push("...");
    }

    // Add pages around current page
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      if (!numbers.includes(i)) numbers.push(i);

    // Add ellipsis if there's a gap before last page
    if (page < totalPages - 2) numbers.push("...");

    // Add last page if not already included
    if (totalPages > 1 && !numbers.includes(totalPages))
      numbers.push(totalPages);

    return numbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            className="cursor-pointer"
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => handlePageChange(Number(pageNumber))}
                isActive={pageNumber === page}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            className="cursor-pointer"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
