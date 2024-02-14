import { useDispatch, useSelector } from "react-redux";
import { selectCurrentCart, selectTotalPrice } from "./cartSlice";
import { formatCurrency } from "../../utilities/helper";
import { Link } from "react-router-dom";

import CartItem from "./CartItem";
import Button from "../../components/Button";
import { useEffect } from "react";
import { setOrder } from "../orders/orderSlice";

function CartList() {
  const currentCart = useSelector(selectCurrentCart);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setOrder({
        items: currentCart,
        totalPrice: totalPrice,
      }),
    );
  }, [currentCart, totalPrice]);

  return (
    <div className="mx-auto my-10 flex w-auto flex-col gap-10 rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800 md:p-10 lg:w-[50rem]">
      <span className="text-xs font-semibold text-red-500 dark:text-yellow-400 md:text-base">
        Xin hãy kiểm tra số lượng và giá tiền trước khi đi tới bước tiếp theo
      </span>
      <div className="max-h-[40vh] overflow-auto">
        {currentCart.length !== 0 ? (
          <div className="flex flex-col gap-12 rounded-lg">
            {currentCart.map((item) => (
              <CartItem item={item} key={item._id} />
            ))}
          </div>
        ) : (
          <p className="p-10 text-center">
            Hiện chưa có sản phẩm.{" "}
            <Link to="/books" className="underline">
              Đi tới mua sắm
            </Link>
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-6 border-t py-4 dark:border-t-slate-600">
        <div className="flex gap-2">
          <p>Tổng tiền: </p>
          <span className="font-bold text-red-500 dark:text-red-400">
            {formatCurrency(totalPrice)}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-6">
          <Link className="text-xs hover:underline md:text-base" to="/books">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartList;
