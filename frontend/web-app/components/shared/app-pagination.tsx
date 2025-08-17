"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "../ui/pagination";

type Props = {
  currentPage: number;
  pageCount: number;
  pageChanged: (page: number) => void;
};

export default function AppPagination({
  currentPage,
  pageCount,
  pageChanged,
}: Props) {
  // Function to generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(pageCount, currentPage + delta);

    // Adjust for edge cases
    if (currentPage <= delta + 1) {
      end = Math.min(pageCount, delta * 2 + 1);
    }
    if (currentPage >= pageCount - delta) {
      start = Math.max(1, pageCount - delta * 2);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add ellipsis if needed
    if (start > 2) {
      rangeWithDots.push(1);
      if (start > 3) rangeWithDots.push("...");
    }
    rangeWithDots.push(...range);
    if (end < pageCount - 1) {
      if (end < pageCount - 2) rangeWithDots.push("...");
      rangeWithDots.push(pageCount);
    }

    return rangeWithDots;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) pageChanged(currentPage - 1);
            }}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  pageChanged(page);
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < pageCount) pageChanged(currentPage + 1);
            }}
            className={
              currentPage === pageCount ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
