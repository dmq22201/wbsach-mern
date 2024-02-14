import BookCard from "./BookCard";

function BookList({ books }) {
  return (
    <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 md:gap-10 lg:grid-cols-4">
      {books.data.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}

export default BookList;
