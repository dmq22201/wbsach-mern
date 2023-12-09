import BookList from "../features/books/BookList";
import BookFilter from "../features/books/BookFilter";
import BookSortby from "../features/books/BookSortby";
import BookStateFilter from "../features/books/BookStateFilter";

function Books() {
  return (
    <div className="grid grid-cols-1 items-start divide-y-2 bg-white p-8">
      <div className="flex flex-col items-center justify-end gap-6 py-4 md:flex-row">
        <BookStateFilter />
        <BookFilter />
        <BookSortby />
      </div>
      <div className="py-8">
        <BookList />
      </div>
    </div>
  );
}

export default Books;
