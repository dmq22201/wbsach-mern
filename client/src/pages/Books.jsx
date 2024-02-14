import { useGetBooksQuery } from "../features/books/bookApiSlice";
import { useEffect, useState } from "react";
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
  const limit = Number(searchParams.get("limit")) || 8;
  const sortby = searchParams.get("sortby") || "price";
  const status = searchParams.get("status") || "inStock";
  const search = searchParams.get("search") || undefined;
  const genres = searchParams.get("genres") || undefined;
  const minPrice = Number(searchParams.get("minPrice")) || undefined;
  const maxPrice = Number(searchParams.get("maxPrice")) || undefined;

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
    genres,
    minPrice,
    maxPrice,
  });

  useEffect(() => {
    if (currentPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div className="grid grid-cols-1 items-start divide-y-2 rounded-lg bg-white py-10 shadow-lg dark:divide-slate-700 dark:bg-slate-800 md:p-10">
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
        {!isFetching && !isSuccess && isError && (
          <p className="text-center">Hiện tại chưa có sản phẩm nào</p>
        )}
        {!isFetching && isSuccess && !isError && books?.data?.length === 0 && (
          <p className="text-center">Hiện tại chưa có sản phẩm nào</p>
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
