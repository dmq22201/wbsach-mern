import { Link, useParams } from "react-router-dom";
import { useGetBookQuery } from "./bookApiSlice";
import { formatCurrency } from "../../utilities/helper";
import {
  useSendDeleteFavoriteListMutation,
  useSendUpdateFavoriteListMutation,
} from "../auth/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import { HiOutlineHeart, HiHeart } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { addBook, calcTotalPrice, selectCurrentCart } from "../cart/cartSlice";

import SpinnerIcon from "../../components/SpinnerIcon";
import Button from "../../components/Button";

function BookDetails() {
  let content;
  const params = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const currentCart = useSelector(selectCurrentCart);
  const [check, setCheck] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const {
    data: book,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetBookQuery(params.slug);

  const [sendUpdateFavoriteList] = useSendUpdateFavoriteListMutation();
  const [sendDeleteFavoriteList] = useSendDeleteFavoriteListMutation();

  useEffect(() => {
    if (currentUser && isSuccess) {
      const result = currentUser.favoriteList.some(
        (fav) => fav._id.toString() === book.data._id,
      );
      setCheck(result);
    }
  }, [currentUser, isSuccess]);

  const handleAddToFavorite = async (bookId) => {
    try {
      await sendUpdateFavoriteList({
        bookId: bookId,
      }).unwrap();
      setCheck((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteToFavorite = async (bookId) => {
    try {
      await sendDeleteFavoriteList({
        bookId: bookId,
      }).unwrap();
      setCheck((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = (book) => {
    dispatch(addBook({ book, quantity }));
    dispatch(calcTotalPrice());
  };

  if (isFetching) {
    content = <SpinnerIcon size="xl" center={true} />;
  } else if (isSuccess) {
    const genres = book.data.genres.map((genre) => ({
      name: genre.name,
      slug: genre.slug,
    }));

    const authors = book.data.authors.map((author) => ({
      fullName: author.fullName,
      slug: author.slug,
    }));

    content = (
      <div className="flex flex-col gap-10 p-2">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex flex-col gap-10">
            <img
              src={book.data.coverImage}
              alt={book.data.name}
              className="h-full w-96 rounded-lg"
            />

            <div className="mt-auto flex flex-col gap-6">
              <div className="flex flex-wrap gap-2 overflow-auto">
                <p>Thể loại: </p>
                {genres.map((genre, index) =>
                  index === genres.length - 1 ? (
                    <Link
                      key={genre.slug}
                      className="font-semibold text-slate-500 transition-all hover:text-black dark:hover:text-slate-400"
                      to={`/books/?genres=${genre.slug}`}
                    >
                      {genre.name}
                    </Link>
                  ) : (
                    <Link
                      key={genre.slug}
                      className="font-semibold text-slate-500 transition-all hover:text-black dark:hover:text-slate-400"
                      to={`/books/?genres=${genre.slug}`}
                    >
                      {genre.name},
                    </Link>
                  ),
                )}
              </div>
              <div className="flex flex-wrap gap-2 overflow-auto">
                <p> Tác giả: </p>
                {authors.map((author, index) =>
                  index === authors.length - 1 ? (
                    <Link
                      key={author.slug}
                      className="font-semibold text-slate-500 transition-all hover:text-black dark:hover:text-slate-400"
                    >
                      {author.fullName}
                    </Link>
                  ) : (
                    <Link
                      key={author.slug}
                      className="font-semibold text-slate-500 transition-all hover:text-black dark:hover:text-slate-400"
                    >
                      {author.fullName},
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <p className="text-2xl font-semibold">{book.data.name}</p>

            {book.data.stockQuantity === 0 ? (
              <p className="w-fit rounded-lg bg-red-500 p-2 font-bold capitalize text-white">
                Hết hàng
              </p>
            ) : (
              <div className="flex flex-col items-center gap-6 text-xs md:flex-row md:text-base">
                <div className="flex gap-6 border-2 text-xs dark:border-slate-500 lg:text-2xl">
                  <button
                    className="border-2 border-b-0 border-l-0 border-t-0 p-2 hover:bg-slate-100 dark:border-slate-500 dark:hover:bg-slate-600"
                    onClick={() => {
                      if (quantity === 10) return;
                      setQuantity((prev) => prev + 1);
                    }}
                  >
                    +
                  </button>
                  <p className="p-2 font-bold">{quantity}</p>
                  <button
                    className="border-2 border-b-0 border-r-0 border-t-0 p-2 hover:bg-slate-100 dark:border-slate-500 dark:hover:bg-slate-600"
                    onClick={() => {
                      if (quantity === 1) return;
                      setQuantity((prev) => prev - 1);
                    }}
                  >
                    -
                  </button>
                </div>
                <span>X</span>
                <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                  {formatCurrency(book.data.price * quantity)}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <p className="text-xl font-semibold">Tóm tắt</p>
              <p>{book.data.description}</p>
            </div>
            {book.data.stockQuantity !== 0 && (
              <div className="flex flex-col items-center gap-6 text-sm lg:flex-row">
                <Button
                  type="success"
                  component="button"
                  onClick={() => handleAddToCart(book.data)}
                >
                  🛒 Thêm vào giỏ hàng
                </Button>

                {currentUser && check && (
                  <button
                    onClick={() => handleDeleteToFavorite(book.data._id)}
                    className="flex items-center gap-2 p-2 text-2xl text-pink-500 transition-all"
                  >
                    <HiHeart />
                    <span className="text-xs md:text-base">Xóa yêu thích</span>
                  </button>
                )}

                {currentUser && !check && (
                  <button
                    onClick={() => handleAddToFavorite(book.data._id)}
                    className="flex items-center gap-2 rounded-full p-2 text-2xl font-bold transition-all hover:bg-pink-500 hover:text-white "
                  >
                    <HiOutlineHeart />
                    <span className="text-xs md:text-base">Yêu thích</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white py-10 shadow-lg dark:bg-slate-800 md:p-10">
      {content}
    </div>
  );
}

export default BookDetails;
