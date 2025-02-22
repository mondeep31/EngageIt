import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationTableProps {
  table: any;
  data: any[];
}

export default function PaginationTable({ table, data }: PaginationTableProps) {
  const currentPage = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  // Ensure we're calculating the correct number of pages
  const totalRows = data.length;
  const pageCount = Math.ceil(totalRows / pageSize);

  // Function to handle page change with boundary check
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < pageCount) {
      table.setPageIndex(page);
    }
  };

  // Calculate start and end entries for current page
  const startEntry = totalRows === 0 ? 0 : currentPage * pageSize + 1;
  const endEntry = Math.min((currentPage + 1) * pageSize, totalRows);

  // Check if pagination should be shown
  const showPagination = totalRows > 0;

  return (
    <div className="flex flex-col items-center justify-end gap-2 py-3 sm:flex-row sm:gap-4">
      <div className="rounded-lg bg-white px-3 py-[7px] text-xs font-medium text-[#707079] shadow-sm">
        {totalRows === 0 ? (
          "No entries found"
        ) : (
          <>
            Showing&nbsp;
            <span className="text-black">
              {startEntry} - {endEntry}
            </span>
            &nbsp;of&nbsp;
            <span className="text-black">{totalRows}</span> Entries
          </>
        )}
      </div>
      {showPagination && pageCount > 1 && (
        <div className="rounded-lg shadow-sm">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="cursor-pointer"
                />
              </PaginationItem>

              {/* First page */}
              {pageCount > 2 && currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(0)}
                    className="cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* First ellipsis */}
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => {}}
                    className="pointer-events-none"
                  >
                    ...
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Page numbers */}
              {[...Array(pageCount)].map((_, index) => {
                // Show current page and one page before and after
                if (
                  index === currentPage ||
                  index === currentPage - 1 ||
                  index === currentPage + 1
                ) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={index === currentPage}
                        onClick={() => handlePageChange(index)}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {/* Last ellipsis */}
              {currentPage < pageCount - 3 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => {}}
                    className="pointer-events-none"
                  >
                    ...
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Last page */}
              {pageCount > 2 && currentPage < pageCount - 2 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(pageCount - 1)}
                    className="cursor-pointer"
                  >
                    {pageCount}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pageCount - 1}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
