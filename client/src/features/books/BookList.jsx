import { selectAllBooks } from "./bookApiSlice";
import { useSelector } from "react-redux";

import BookCard from "./BookCard";

function BookList() {
  const books = useSelector(selectAllBooks);

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 md:gap-10 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookList;
