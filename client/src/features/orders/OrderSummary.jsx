import { useSelector } from "react-redux";
import { selectCurrentCart, selectTotalPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utilities/helper";
import { selectCurrentPaymentMethod } from "./orderSlice";
import InputMsg from "../../components/InputMsg";

function OrderDetail({ msgFromServer }) {
  const currentCart = useSelector(selectCurrentCart);
  const totalPrice = useSelector(selectTotalPrice);
  const currentPaymentMethod = useSelector(selectCurrentPaymentMethod);

  return (
    <div className="mx-auto my-10 flex w-auto flex-col gap-10 rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800 md:p-10 lg:w-[50rem]">
      {msgFromServer && (
        <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
      )}
      {currentCart.map((item) => (
        <div className="flex items-center justify-start gap-6" key={item._id}>
          <img
            src={item.coverImage}
            alt={item.name}
            className="h-16 w-16 rounded-lg"
          />
          <p>{item.name}</p>
          <p>
            {item.quantity} x {formatCurrency(item.price)}
          </p>
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <p className="font-semibold">
          Tổng số tiền:{" "}
          <span className="text-red-500 dark:text-red-400">
            {formatCurrency(totalPrice)}
          </span>
        </p>
        <p className="font-semibold">
          Phương thức giao dịch:{" "}
          <span className="text-green-500 dark:text-green-400">
            {currentPaymentMethod === "directTransaction"
              ? "Thanh toán khi nhận hàng"
              : "Chuyển khoản ngân hàng"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default OrderDetail;
