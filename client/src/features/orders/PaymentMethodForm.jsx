import { useDispatch, useSelector } from "react-redux";
import Accordion from "../../components/Accordion";
import { selectPaymentMethod, setPaymentMethod } from "../cart/cartSlice";
import { useEffect } from "react";
import { setInformation } from "./orderSlice";

function PaymentMethodForm({ setIsCanNext }) {
  const dispatch = useDispatch();
  const currentPaymentMethod = useSelector(selectPaymentMethod);

  useEffect(() => {
    if (currentPaymentMethod === "") setIsCanNext(false);
    else {
      dispatch(setInformation({ paymentMethod: currentPaymentMethod }));
      setIsCanNext(true);
    }
  }, [currentPaymentMethod]);

  return (
    <div className="mx-auto my-10 flex w-auto flex-col gap-10 rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800 md:p-10 lg:w-[50rem]">
      <h2 className="block pb-6 text-center font-roboto text-xl font-medium uppercase dark:text-white sm:text-2xl">
        Vui lòng chọn phương thức giao dịch
      </h2>

      <Accordion>
        {/* <Accordion.Item>
          <Accordion.Toggle
            id="onlineTransaction"
            onClick={() => dispatch(setPaymentMethod("onlineTransaction"))}
          >
            Chuyển khoản ngân hàng
          </Accordion.Toggle>
        </Accordion.Item> */}
        <Accordion.Item>
          <Accordion.Toggle
            id="directTransaction"
            onClick={() => {
              dispatch(setPaymentMethod("directTransaction"));
            }}
          >
            Thanh toán khi nhận hàng
          </Accordion.Toggle>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default PaymentMethodForm;
