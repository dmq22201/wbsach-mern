import { Link } from "react-router-dom";
import { formatCurrency } from "../../utilities/helper";

function BookCard({ book }) {
  return (
    <Link
      to={`${book.slug}`}
      className="flex flex-col gap-6 rounded-lg border shadow-md transition-all hover:scale-105 hover:shadow-xl dark:border-slate-700"
    >
      <div>
        <img
          src={book.coverImage}
          alt={book.name}
          className="m-auto h-60 w-full rounded-lg md:h-80"
        />
      </div>
      {/* <div className="mt-auto flex flex-col gap-2">
        <p className="font-medium">{book.name}</p>
        <p className="md:text-md text-sm font-semibold text-red-500">
          {formatCurrency(book.price)}
        </p>
      </div> */}
    </Link>
  );
}

export default BookCard;
