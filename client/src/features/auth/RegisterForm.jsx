import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSendRegisterMutation } from "./authApiSlice";
import {
  REGEX_EMAIL,
  REGEX_FULLNAME,
  REGEX_PASSWORD,
  REGEX_USERNAME,
} from "../../utilities/constants";

import Form from "../../components/Form";
import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Button from "../../components/Button";
import InputMsg from "../../components/InputMsg";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const [sendRegister, { isLoading, isSuccess }] = useSendRegisterMutation();

  const [msgFromServer, setMsgFromServer] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await sendRegister(data).unwrap();
      setMsgFromServer(res);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  let content;

  if (!isSuccess) {
    content = (
      <Form headingText="Đăng ký tài khoản" onSubmit={handleSubmit(onSubmit)}>
        {msgFromServer && (
          <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
        )}
        <InputGroup>
          <Label htmlFor="username">Tên tài khoản</Label>
          <Input
            type="text"
            id="username"
            placeholder="Xin hãy nhập tên tài khoản... vd: NhockSockZipPro2k1"
            autoComplete="on"
            disabled={isLoading || isSuccess}
            {...register("username", {
              required: "Xin đừng bỏ trống tên tài khoản",
              pattern: {
                value: REGEX_USERNAME,
                message:
                  "Tên tài khoản tối từ 4 - 20 ký tự, chữ cái và số, không ký tự đặc biệt",
              },
              // validate: async (fieldValue) => {
              //   const response = await fetch(
              //     `http://127.0.0.1:3000/api/v1/auth/check-duplicate/?username=${fieldValue}`,
              //   );

              //   const data = await response.json();

              //   return (
              //     !data.isExist ||
              //     "tên tài khoản đã được sử dụng. Vui lòng nhập tên tài khoản khác"
              //   );
              // },
            })}
          />
          {errors && <InputMsg msg={errors?.username?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            type="password"
            id="password"
            placeholder="Xin hãy nhập mật khẩu của bạn..."
            autoComplete="off"
            disabled={isLoading || isSuccess}
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
          <Label htmlFor="passwordConfirm">Nhập lại mật khẩu</Label>
          <Input
            type="password"
            id="passwordConfirm"
            placeholder="Xin hãy nhập lại mật khẩu của bạn một lần nữa..."
            autoComplete="off"
            disabled={isLoading || isSuccess}
            {...register("passwordConfirm", {
              required: "Vui lòng nhập lại mật khẩu.",
              // validate: (fieldValue) => {
              //   return (
              //     fieldValue === getValues().password ||
              //     "Nhập lại mật khẩu không khớp"
              //   );
              // },
            })}
          />
          {errors && <InputMsg msg={errors?.passwordConfirm?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="email">Địa chỉ Email</Label>
          <Input
            type="text"
            id="email"
            placeholder="Nhập địa chỉ email của bạn vd: <your-email>@example.com"
            disabled={isLoading || isSuccess}
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
              //     "Email bạn nhập đã được đăng ký với tài khoản khác. Vui lòng nhậps email khác"
              //   );
              // },
            })}
          />
          {errors && <InputMsg msg={errors?.email?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="fullName">Họ tên</Label>
          <Input
            type="text"
            id="fullName"
            placeholder="Nhập họ tên của bạn"
            autoComplete="on"
            disabled={isLoading || isSuccess}
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
          <Button
            type="success"
            component="button"
            isLoading={isLoading}
            disabled={isLoading || !isValid || isSuccess}
          >
            {isLoading ? <span>Đang đăng ký...</span> : <span>Đăng ký</span>}
          </Button>
        </InputGroup>
        <InputGroup>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link
              to="/forgot"
              className="text-sm transition-colors hover:text-violet-700 md:text-base"
            >
              Quên tài khoản hoặc mật khẩu?
            </Link>
            <Link
              to="/login"
              className="text-sm underline transition-colors hover:text-violet-700 md:text-base"
            >
              Đã có tài khoản? Đăng nhập
            </Link>
            <Link
              to="/send-verify-email"
              className="text-sm underline hover:text-violet-700 md:text-base"
            >
              Không nhận được email xác thực?
            </Link>
          </div>
        </InputGroup>
      </Form>
    );
  } else if (isSuccess && msgFromServer) {
    content = <InputMsg msgFromServer={msgFromServer} isFromServer={true} />;
  }

  return (
    <div className="mx-auto rounded-xl bg-white p-8 shadow-md lg:w-[36.75rem]">
      {content}
    </div>
  );
}

export default RegisterForm;
