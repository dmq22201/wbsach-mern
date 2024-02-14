import { clearCart, selectCurrentCart } from "./cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import useSteps from "../../hooks/useSteps";
import CheckoutForm from "../orders/CheckoutForm";
import CartList from "./CartList";
import Button from "../../components/Button";
import PaymentMethodForm from "../orders/PaymentMethodForm";
import OrderSummary from "../orders/OrderSummary";
import { useSendOrderMutation } from "../orders/orderApiSlice";
import { selectCurrentOrder } from "../orders/orderSlice";
import { useSendSyncCartMutation } from "../auth/authApiSlice";
import { selectCurrentUser } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";

function CartDetails({ setIsOrderConfirm }) {
  const currentCart = useSelector(selectCurrentCart);
  const currentOrder = useSelector(selectCurrentOrder);
  const currentUser = useSelector(selectCurrentUser);
  const [isCanNext, setIsCanNext] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const [msgFromServer, setMsgFromServer] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const steps = [
    {
      label: "Giỏ hàng",
      content: <CartList />,
    },
    {
      label: "Thông tin nhận hàng",
      content: <CheckoutForm setIsCanNext={setIsCanNext} />,
    },
    {
      label: "Phương thức giao dịch",
      content: <PaymentMethodForm setIsCanNext={setIsCanNext} />,
    },
    {
      label: "Xác nhận",
      content: <OrderSummary msgFromServer={msgFromServer} />,
    },
  ];

  const {
    step: currentStepContent,
    currentStepIndex,
    prev,
    next,
    goto,
  } = useSteps(steps);

  const [sendOrder, { isFetching, isSuccess, isError, error }] =
    useSendOrderMutation();

  const [sendSyncCart] = useSendSyncCartMutation();

  useEffect(() => {
    if (currentCart.length === 0 && isDone) setIsOrderConfirm(true);
    else if (currentCart.length === 0) goto(0);

    console.log(`run`);
  }, [currentStepIndex, currentCart, isDone]);

  const handleConfirm = async () => {
    try {
      await sendOrder(currentOrder);
      await sendSyncCart({ cart: [] });
      localStorage.setItem("cart", null);
      dispatch(clearCart());
      setIsDone(true);
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <div>
      <div className="mx-auto flex items-center justify-between lg:w-[50rem]">
        {steps.map((step, index) => {
          return (
            <div
              className="flex flex-col items-center justify-center gap-6"
              key={index + 1}
            >
              <p
                className={`flex h-10 w-10 flex-col items-center justify-center rounded-full text-xs leading-10 shadow-lg transition-all md:text-base ${
                  currentStepIndex === index
                    ? "bg-violet-500 text-white"
                    : "bg-white dark:bg-slate-700"
                }`}
              >
                {index + 1}
              </p>
              <p className="text-center text-xs font-semibold md:text-base">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
      {currentStepContent.content}
      {currentCart.length === 0 ? null : (
        <div className="flex justify-center gap-6">
          {currentStepIndex !== 0 && (
            <Button
              type="outline"
              component="button"
              onClick={() => {
                setIsCanNext(true);
                prev();
              }}
            >
              Quay lại
            </Button>
          )}

          {currentStepIndex === steps.length - 1 ? (
            <Button
              type="success"
              component="button"
              disabled={!isCanNext || isFetching}
              onClick={handleConfirm}
            >
              {isFetching ? "Đang xác nhận" : "Xác nhận"}
            </Button>
          ) : currentUser ? (
            <Button
              type="success"
              component="button"
              onClick={next}
              disabled={!isCanNext}
            >
              Tiếp tục
            </Button>
          ) : (
            <Button
              type="success"
              component="button"
              onClick={() => navigate("/login")}
            >
              Vui lòng đăng nhập tài khoản
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default CartDetails;
