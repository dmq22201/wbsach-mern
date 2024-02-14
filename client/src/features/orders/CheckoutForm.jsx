import { useDispatch, useSelector } from "react-redux";
import { selectCurrentCart } from "../cart/cartSlice";
import { selectCurrentUser } from "../auth/authSlice";

import Form from "../../components/Form";
import Input from "../../components/Input";
import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import { useForm } from "react-hook-form";
import {
  REGEX_EMAIL,
  REGEX_FULLNAME,
  REGEX_PHONENUMBER,
} from "../../utilities/constants";
import InputMsg from "../../components/InputMsg";
import { selectCurrentInformation, setInformation } from "./orderSlice";
import { useEffect, useState } from "react";
import { useSendNewShippingAddressMutation } from "../auth/authApiSlice";

function CheckoutForm({ setIsCanNext }) {
  const currentUser = useSelector(selectCurrentUser);
  const currentCart = useSelector(selectCurrentCart);
  const currentInformation = useSelector(selectCurrentInformation);
  const [showMoreAddress, setShowMoreAddress] = useState(false);
  const [msgFromServer, setMsgFromServer] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      fullName: currentUser?.fullName || currentInformation?.fullName || "",
      email: currentUser?.email || currentInformation?.email || "",
      phoneNumber: currentInformation?.phoneNumber || "",
      shippingAddress: currentInformation?.shippingAddress || "",
    },
    mode: "onChange",
  });

  const [sendNewShippingAddress, { isLoading, isSuccess, isError }] =
    useSendNewShippingAddressMutation();

  useEffect(() => {
    return () => {
      dispatch(
        setInformation({
          ...getValues(),
        }),
      );
    };
  }, []);

  useEffect(() => {
    if (isValid) setIsCanNext(true);
    else setIsCanNext(false);
  }, [isValid]);

  useEffect(() => {
    reset({
      fullName: currentUser?.fullName || currentInformation?.fullName || "",
      email: currentUser?.email || currentInformation?.email || "",
      phoneNumber: currentInformation?.phoneNumber || "",
      shippingAddress: currentInformation?.shippingAddress || "",
    });
  }, [currentInformation]);

  return (
    <div className="mx-auto my-10 flex w-auto flex-col gap-10 rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800 md:p-10 lg:w-[50rem]">
      <Form headingText="Thông tin nhận hàng">
        <InputGroup>
          <Label htmlFor="fullName">Họ tên</Label>
          <Input
            type="text"
            id="fullName"
            placeholder="Nhập họ tên của bạn"
            autoComplete="on"
            {...register("fullName", {
              required: "Vui lòng cho biết tên",
              pattern: {
                value: REGEX_FULLNAME,
                message:
                  "Tên của bạn từ 4 - 20 ký tự, chỉ có chữ không có số, hay ký tự đặc biệt",
              },
            })}
          />
          {errors && <InputMsg msg={errors?.fullName?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            type="text"
            id="phoneNumber"
            placeholder="Nhập số điện thoại của bạn"
            autoComplete="on"
            {...register("phoneNumber", {
              required: "Vui lòng cho số điện thoại của bạn",
              pattern: {
                value: REGEX_PHONENUMBER,
                message: "Số điện thoại của bạn không hợp lệ.",
              },
            })}
          />
          {errors && <InputMsg msg={errors?.phoneNumber?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="email">Địa chỉ Email</Label>
          <Input
            type="text"
            id="email"
            placeholder="Nhập địa chỉ email của bạn vd: <your-email>@example.com"
            autoComplete="on"
            {...register("email", {
              required: "Vui lòng nhập lại mật khẩu.",
              pattern: {
                value: REGEX_EMAIL,
                message: "Địa chỉ email của bạn nhập không hợp lệ",
              },
            })}
          />
          {errors && <InputMsg msg={errors?.email?.message} />}
        </InputGroup>
        {currentUser ? (
          <InputGroup>
            <Label htmlFor="shippingAddress">Địa chỉ nhận hàng</Label>

            <div className="flex w-full flex-col justify-between gap-6 rounded-lg rounded-l-lg border bg-slate-50 dark:border-gray-600 dark:bg-gray-700 lg:flex-row">
              <input
                className="flex-grow rounded-l-lg bg-transparent p-2.5 focus:outline-none"
                id="shippingAddress"
                placeholder="Nhập địa chỉ nhận hàng của bạn"
                autoComplete="on"
                {...register("shippingAddress", {
                  required: "Vui lòng địa chỉ nhận hàng.",
                })}
              />
              <button
                type="button"
                onClick={() => setShowMoreAddress((prev) => !prev)}
                className="rounded-b-lg bg-violet-500 p-2.5 text-slate-200 transition-all hover:text-slate-50 focus:outline-none lg:rounded-b-none lg:rounded-r-lg lg:rounded-br-lg"
              >
                Hoặc chọn địa chỉ có sẵn
              </button>
            </div>

            {showMoreAddress && (
              <div className="flex flex-col items-start gap-6 rounded-lg bg-slate-50 p-4 text-xs dark:bg-gray-700 md:text-base lg:text-base">
                {currentUser.shippingAddress.map((item, index) => {
                  return (
                    <div
                      className="flex w-full justify-between gap-10"
                      key={index}
                    >
                      <button
                        type="button"
                        className="font-semibold text-slate-400 transition-all hover:text-black dark:hover:text-white"
                        onClick={() => {
                          dispatch(
                            setInformation({
                              shippingAddress: item.address,
                              phoneNumber: item.phoneNumber,
                            }),
                          );
                          setShowMoreAddress(false);
                        }}
                      >
                        Chọn
                      </button>
                      <p className="flex-wrap text-right">
                        Địa chỉ:
                        <span className="font-semibold">{item.address}</span> -
                        Số điện thoại:
                        <span className="font-semibold">
                          {item.phoneNumber}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </InputGroup>
        ) : (
          <InputGroup>
            <Label htmlFor="shippingAddress">Địa chỉ nhận hàng</Label>
            <Input
              id="shippingAddress"
              placeholder="Nhập địa chỉ nhận hàng của bạn"
              autoComplete="on"
              {...register("shippingAddress", {
                required: "Vui lòng địa chỉ nhận hàng.",
              })}
            />
            {errors && <InputMsg msg={errors?.email?.message} />}
          </InputGroup>
        )}
      </Form>
    </div>
  );
}

export default CheckoutForm;
