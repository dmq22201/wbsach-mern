import { useState } from "react";
import { useSendResetPasswordMutation } from "./authApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { REGEX_PASSWORD } from "../../utilities/constants";

import Form from "../../components/Form";
import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Button from "../../components/Button";
import InputMsg from "../../components/InputMsg";
import Popup from "../../components/Popup";

function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const [sendResetPassword, { isLoading, isSuccess }] =
    useSendResetPasswordMutation();

  const params = useParams();
  const { passwordResetToken } = params;
  const navigate = useNavigate();

  const [msgFromServer, setMsgFromServer] = useState(null);
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const onSubmit = async (data) => {
    try {
      await sendResetPassword({
        ...data,
        passwordResetToken,
      }).unwrap();

      setIsOpenPopup(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-10 shadow-md dark:bg-slate-800 dark:text-white md:w-[36.75rem]">
      <Form onSubmit={handleSubmit(onSubmit)} headingText="Lấy lại mật khẩu">
        {msgFromServer && (
          <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
        )}
        <InputGroup>
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            type="password"
            id="password"
            placeholder="Nhập mật khẩu"
            autoComplete="off"
            disabled={isLoading || isSuccess}
            {...register("password", {
              required: "Vui lòng nhập mật khẩu mới",
              pattern: {
                value: REGEX_PASSWORD,
                message:
                  "Mật khẩu phải có ít nhất, 8 ký tự, 1 HOA, 1 thường, 1 số, 1 ký tự đặc biệt",
              },
            })}
          />
          {errors && <InputMsg msg={errors?.password?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="passwordConfirm">Nhập lại mật khẩu mới</Label>
          <Input
            type="password"
            id="passwordConfirm"
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="off"
            disabled={isLoading || isSuccess}
            {...register("passwordConfirm", {
              required: "Vui lòng nhập lại mật khẩu mới",
              validate: (fieldValue) => {
                return (
                  fieldValue === getValues().password ||
                  "Nhập lại mật khẩu mới không khớp"
                );
              },
            })}
          />
          {errors && <InputMsg msg={errors?.passwordConfirm?.message} />}
        </InputGroup>
        <InputGroup>
          <Button
            type="success"
            component="button"
            disabled={!isValid || isLoading || isSuccess}
            isLoading={isLoading}
          >
            {isLoading ? (
              <span>Đang xác nhận...</span>
            ) : (
              <span>Xác nhận thay đổi mật khẩu</span>
            )}
          </Button>
        </InputGroup>
      </Form>
      {isSuccess && (
        <Popup isOpenPopup={isOpenPopup}>
          <Popup.Window type="success">
            Thay đổi mật khẩu thành công
          </Popup.Window>
        </Popup>
      )}
    </div>
  );
}

export default ResetPasswordForm;
