import { useGetBooksQuery } from "../features/books/bookApiSlice";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import BookList from "../features/books/BookList";
import BookFilter from "../features/books/BookFilter";
import BookSortby from "../features/books/BookSortby";
import BookStatusFilter from "../features/books/BookStatusFilter";
import SpinnerIcon from "../components/SpinnerIcon";
import Pagination from "../components/Pagination";
import BookLimitPerPage from "../features/books/BookLimitPerPage";

function Books() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const sortby = searchParams.get("sortby") || "price";
  const status = searchParams.get("status") || "inStock";
  const search = searchParams.get("search") || undefined;

  const {
    data: books,
    isFetching,
    isSuccess,
    isError,
  } = useGetBooksQuery({
    page: currentPage,
    limit,
    sortby,
    status,
    search,
  });

  useEffect(() => {
    if (currentPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div className="grid grid-cols-1 items-start divide-y-2 rounded-lg bg-white p-10 dark:divide-slate-700 dark:bg-slate-800">
      <div className="flex flex-col items-center justify-between gap-6 py-4 lg:flex-row">
        <BookFilter />
        <div className="flex flex-col items-center gap-6 lg:flex-row">
          <BookStatusFilter
            status={status}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
          <BookSortby
            sortby={sortby}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
          <BookLimitPerPage
            limit={limit}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        </div>
      </div>

      <div className="py-8">
        {isFetching && <SpinnerIcon size="xl" center={true} />}
        {!isFetching && isSuccess && <BookList books={books} />}
        {!isFetching && !isSuccess && isError && <h1>ERROR</h1>}
        {!isFetching && isSuccess && !isError && books?.data?.length === 0 && (
          <h1>Không có sản phẩm nào</h1>
        )}
      </div>
      <div>
        {!isFetching && isSuccess && (
          <Pagination
            books={books}
            currentPage={currentPage}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        )}
      </div>
    </div>
  );
}

export default Books;
