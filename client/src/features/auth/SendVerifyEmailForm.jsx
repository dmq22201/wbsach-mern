import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSendVerifyEmailMutation } from "./authApiSlice";
import useCountdown from "../../hooks/useCountdown";

import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Form from "../../components/Form";
import InputMsg from "../../components/InputMsg";

function SendVerifyEmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [sendVerifyEmail, { isLoading }] = useSendVerifyEmailMutation();

  const { secondsLeft, setSecondLeft } = useCountdown();
  const [msgFromServer, setMsgFromServer] = useState(null);

  const onSubmit = async (data) => {
    try {
      const res = await sendVerifyEmail(data).unwrap();
      setMsgFromServer(res);
      setSecondLeft(30);
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status || err.originalStatus,
        message: err.data?.message || err.data,
      });
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-10 shadow-md dark:bg-slate-800 dark:text-white md:w-[36.75rem]">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        headingText="Gửi lại thư xác minh email"
      >
        {msgFromServer && (
          <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
        )}

        <InputGroup>
          <Label htmlFor="email">Địa chỉ email</Label>
          <Input
            type="text"
            id="email"
            placeholder="Nhập email.. vd: example@mail.com"
            autoComplete="on"
            disabled={
              isLoading || secondsLeft > 0 || msgFromServer?.status === 429
            }
            {...register("email", {
              required: "Vui lòng nhập email",
            })}
          />
          {errors && <InputMsg msg={errors?.email?.message} />}
        </InputGroup>
        <InputGroup>
          <Button
            type="primary"
            component="button"
            isLoading={isLoading}
            disabled={
              !isValid ||
              isLoading ||
              secondsLeft > 0 ||
              msgFromServer?.status === 429
            }
          >
            {isLoading ? (
              <span>Đang gửi yêu cầu...</span>
            ) : secondsLeft > 0 ? (
              <span>
                Chưa nhận được email ?. Gửi lại sau{" "}
                <span className="font-semibold">{secondsLeft}</span> giây
              </span>
            ) : (
              <span>Gửi yêu cầu</span>
            )}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default SendVerifyEmailForm;
