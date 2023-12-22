import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useSendConfirmDeleteAccountMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogout } from "./authSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "../../components/Button";
import InputMsg from "../../components/InputMsg";
import Form from "../../components/Form";
import Label from "../../components/Label";
import InputGroup from "../../components/InputGroup";
import Input from "../../components/Input";

function DeleteAccountForm({ onCloseModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [sendConfirmDeleteAccount, { isLoading, isSuccess }] =
    useSendConfirmDeleteAccountMutation();

  const [msgFromServer, setMsgFromServer] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await sendConfirmDeleteAccount(data).unwrap();
      setMsgFromServer(res);
      setTimeout(() => {
        dispatch(setLogout());
        navigate("/home");
      }, 3000);
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <>
      {!isSuccess ? (
        <div className="flex flex-col gap-6">
          <HiOutlineExclamationTriangle className="h-20 w-20 self-center text-orange-500" />
          <p className="font-medium text-red-600 dark:text-red-400">
            Bạn có muốn xóa tài khoản không?. Nếu có hãy nhập{" "}
            <span className="text-red font-bold underline">tên tài khoản</span>{" "}
            bạn vào.
          </p>

          {msgFromServer && (
            <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <Label htmlFor="username">Tên tài khoản</Label>
              <Input
                type="text"
                id="username"
                placeholder="Xin hãy nhập tên tài khoản..."
                autoComplete="on"
                disabled={isLoading || isSuccess}
                {...register("username", {
                  required: "Vui lòng nhập tài khoản",
                })}
              />
              {errors && <InputMsg msg={errors?.username?.message} />}
            </InputGroup>

            <InputGroup isVertical={false} isHorizontal={true}>
              <Button
                type="warning"
                size="md"
                component="button"
                disabled={isLoading || isSuccess}
              >
                Đồng ý
              </Button>
              <Button
                type="outline"
                size="md"
                canSubmit={false}
                component="button"
                onClick={() => onCloseModal?.()}
                disabled={isLoading || isSuccess}
              >
                Đóng
              </Button>
            </InputGroup>
          </Form>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6">
          <HiOutlineCheckCircle className="h-28 w-28 text-green-500" />
          <p className="text-base font-semibold uppercase sm:text-2xl">
            {msgFromServer?.message}
          </p>
        </div>
      )}
    </>
  );
}

export default DeleteAccountForm;
