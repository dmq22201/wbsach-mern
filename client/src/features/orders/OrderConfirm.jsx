import { useDispatch, useSelector } from "react-redux";
import { HiCheckCircle } from "react-icons/hi2";
import { useEffect } from "react";
import { clearOrderState, selectCurrentPaymentMethod } from "./orderSlice";
import { useNavigate } from "react-router-dom";

function OrderConfirm() {
  const currentPaymentMethod = useSelector(selectCurrentPaymentMethod);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let content;

  useEffect(() => {
    const id = setTimeout(() => {
      navigate("/");
      dispatch(clearOrderState());
    }, 3000);

    return () => clearTimeout(id);
  }, []);

  if (currentPaymentMethod === "directTransaction") {
    content = (
      <div className="mt-20 flex flex-col items-center justify-center gap-6">
        <span className="block pb-6 text-center font-roboto text-xl font-medium uppercase dark:text-white sm:text-2xl">
          Thành công
        </span>
        <HiCheckCircle className="text-[4rem] text-green-500 dark:text-green-400" />
        <p>Chúc mừng bạn đã đặt hàng thành công.</p>
      </div>
    );
  }

  return content;
}

export default OrderConfirm;
