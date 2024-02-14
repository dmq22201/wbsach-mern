import { useSendUpdateSecurityPasswordMutation } from "./authApiSlice";
import { useForm } from "react-hook-form";
import { REGEX_PASSWORD } from "../../utilities/constants";
import { useEffect, useState } from "react";

import InputMsg from "../../components/InputMsg";
import Form from "../../components/Form";
import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Button from "../../components/Button";

function UpdatePasswordForm() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "all",
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [sendUpdateSecurityPassword, { isLoading, isSuccess, isError }] =
    useSendUpdateSecurityPasswordMutation();

  const [msgFromServer, setMsgFromServer] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      reset({
        oldPassword: "",
        password: "",
        passwordConfirm: "",
      });
    }
  }, [isSuccess]);

  const onSubmit = async (data) => {
    try {
      const res = await sendUpdateSecurityPassword(data).unwrap();
      setMsgFromServer(res);
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {isDirty && !isError && !isSuccess && null}
      {!isDirty && !isError && isSuccess && (
        <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
      )}
      {isDirty && isError && !isSuccess && (
        <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
      )}
      <span className="font-roboto text-xl font-semibold uppercase">
        Mật khẩu
      </span>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
          <Input
            type="password"
            id="oldPassword"
            disabled={isLoading}
            autoComplete="off"
            placeholder="Nhập mật khẩu cũ"
            {...register("oldPassword")}
          />
          {errors && <InputMsg msg={errors?.oldPassword?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Mật khẩu mới</Label>
          <Input
            type="password"
            id="password"
            disabled={isLoading}
            autoComplete="off"
            placeholder="Nhập mật khẩu mới"
            {...register("password", {
              required: "Xin đừng bỏ trống mật khẩu.",
              pattern: {
                value: REGEX_PASSWORD,
                message:
                  "Mật khẩu từ 4 - 20 ký tự, 1 HOA, 1 thường, 1 số, 1 ký tự đặc biệt",
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
            disabled={isLoading}
            autoComplete="off"
            placeholder="Nhập lại mật khẩu mới"
            {...register("passwordConfirm", {
              required: "Vui lòng nhập lại mật khẩu",
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
            isLoading={isLoading}
            disabled={isLoading || !isValid || !isDirty}
          >
            {isLoading ? (
              <>
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <span>Cập nhật mật khẩu mới</span>
            )}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default UpdatePasswordForm;
