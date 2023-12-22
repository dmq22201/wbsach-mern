import {
  HiChevronDoubleLeft,
  HiChevronLeft,
  HiChevronDoubleRight,
  HiChevronRight,
} from "react-icons/hi2";

function Pagination({ books, currentPage, searchParams, setSearchParams }) {
  const pageNumbers = Array.from(
    { length: books.totalPages },
    (_, index) => index + 1,
  );

  const handleSetPage = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
  };

  const handlePreviousPage = () => {
    if (currentPage < 1) {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    } else {
      searchParams.set("page", currentPage - 1);
      setSearchParams(searchParams);
    }
  };

  const handleNextPage = () => {
    if (currentPage > books.totalPages) return;
    searchParams.set("page", currentPage + 1);
    setSearchParams(searchParams);
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-2 font-semibold md:flex-row md:justify-start">
      <div className="flex gap-2">
        {currentPage === 1 ? null : (
          <>
            <button
              disabled={currentPage === 1}
              onClick={() => handleSetPage(1)}
              className="flex h-8 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white "
            >
              <HiChevronDoubleLeft />
            </button>
            <button
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              className="flex h-8 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white "
            >
              <HiChevronLeft />
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`flex h-8 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
              page === Number(currentPage)
                ? "bg-slate-100 dark:bg-slate-700"
                : ""
            }`}
            onClick={() => {
              handleSetPage(page);
            }}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {currentPage >= books.totalPages ? null : (
          <>
            <button
              disabled={currentPage >= books.totalPages}
              className="flex h-8 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={handleNextPage}
            >
              <HiChevronRight />
            </button>
            <button
              disabled={currentPage >= books.totalPages}
              className="flex h-8 items-center justify-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => handleSetPage(books.totalPages)}
            >
              <HiChevronDoubleRight />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Pagination;
