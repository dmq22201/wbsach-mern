import { useState } from "react";
import { useDispatch } from "react-redux";
import { calcTotalPrice, removeBook, updateQuantity } from "./cartSlice";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utilities/helper";

function CartItem({ item }) {
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (item, newQuantity) => {
    dispatch(updateQuantity({ idBook: item._id, newQuantity }));
    dispatch(calcTotalPrice());
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-6">
        <div>
          <Link
            to={`/books/${item.slug}`}
            target="_blank"
            className="flex items-center gap-6"
          >
            <img
              src={item.coverImage}
              alt={item.name}
              className="h-20 w-20 rounded-lg"
            />
            <div className="flex flex-col gap-2">
              <p className="font-semibold">{item.name}</p>
              <p className="font-semibold text-red-500 dark:text-red-400">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <p>Số lượng: {item.quantity}</p>
            </div>
          </Link>
        </div>
        <button
          className={`rounded-lg border border-slate-300 p-2 transition-all hover:bg-slate-50 hover:text-black dark:border-slate-600 dark:hover:bg-slate-600 dark:hover:text-white ${
            showOptions ? "bg-violet-500 text-white" : ""
          }`}
          onClick={() => setShowOptions((prev) => !prev)}
        >
          Tùy chọn
        </button>
      </div>
      <div
        className={`${
          showOptions ? "flex" : "hidden"
        } flex-col gap-6 rounded-lg bg-slate-100 p-2 dark:bg-slate-700 md:flex-row md:justify-between`}
      >
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <span className="font-semibold">Tăng / giảm số lượng: </span>
          <div className="flex w-fit items-center gap-6 border-2 text-xs dark:border-slate-500">
            <button
              className="border-2 border-b-0 border-l-0 border-t-0 p-2 hover:bg-slate-100 dark:border-slate-500 dark:hover:bg-slate-600"
              onClick={() => {
                if (item.quantity === 10) return;
                handleUpdateQuantity(item, item.quantity + 1);
              }}
            >
              +
            </button>
            <p className="font-bold">{item.quantity}</p>
            <button
              className="border-2 border-b-0 border-r-0 border-t-0 p-2 hover:bg-slate-100 dark:border-slate-500 dark:hover:bg-slate-600"
              onClick={() => {
                if (item.quantity === 1) return;
                handleUpdateQuantity(item, item.quantity - 1);
              }}
            >
              -
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <button
            className="font-semibold text-red-500 dark:text-red-400"
            onClick={() => {
              dispatch(removeBook({ idBook: item._id }));
              dispatch(calcTotalPrice());
            }}
          >
            Xóa khỏi giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
