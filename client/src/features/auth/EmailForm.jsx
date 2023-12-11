import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSendUpdateSecurityEmailMutation } from "./authApiSlice";
import { REGEX_EMAIL } from "../../utilities/constants";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";

import InputMsg from "../../components/InputMsg";
import Form from "../../components/Form";
import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Button from "../../components/Button";

function EmailForm() {
  const currentUser = useSelector(selectCurrentUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: currentUser.email,
    },
  });

  const [sendUpdateSecurityEmail, { isLoading, isSuccess, isError }] =
    useSendUpdateSecurityEmailMutation();

  const [msgFromServer, setMsgFromServer] = useState(null);

  useEffect(() => {
    if (currentUser && isSuccess) {
      reset({
        email: currentUser.email,
      });
    }
  }, [currentUser, isSuccess]);

  const onSubmit = async (data) => {
    try {
      const res = await sendUpdateSecurityEmail(data).unwrap();

      setMsgFromServer(res);
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {isDirty && !isError && !isSuccess && null}
      {!isDirty && !isError && isSuccess && (
        <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
      )}
      {isDirty && isError && !isSuccess && (
        <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
      )}
      <span className="font-roboto text-xl font-medium uppercase">
        Địa chỉ email
      </span>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label htmlFor="email">Địa chỉ email</Label>
          <Input
            id="email"
            type="text"
            disabled={isLoading}
            autoComplete="on"
            {...register("email", {
              required: "Vui lòng nhập lại mật khẩu.",
              pattern: {
                value: REGEX_EMAIL,
                message: "Địa chỉ email của bạn nhập không hợp lệ",
              },
              // validate: async (fieldValue) => {
              //   const response = await fetch(
              //     `http://127.0.0.1:3000/api/v1/auth/check-duplicate/?email=${fieldValue}`,
              //   );

              //   const data = await response.json();

              //   return (
              //     !data.isExist ||
              //     "Email bạn nhập đã được đăng ký với tài khoản khác. Vui lòng nhập email khác"
              //   );
              // },
            })}
          />
          {errors && <InputMsg msg={errors?.email?.message} />}
        </InputGroup>

        <InputGroup>
          <Button
            type="success"
            component="button"
            isLoading={isLoading}
            disabled={isLoading || !isValid || !isDirty}
          >
            {isLoading ? (
              <>
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <span>Cập nhật email mới</span>
            )}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default EmailForm;
