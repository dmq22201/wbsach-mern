import { useNavigate, Link } from "react-router-dom";
import { useSendLoginMutation } from "./authApiSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredientials } from "./authSlice";

import Form from "../../components/Form";
import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Button from "../../components/Button";
import InputMsg from "../../components/InputMsg";
import usePersist from "../../hooks/usePersist";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "test_user",
      password: "@Aa123",
    },
  });

  const [sendLogin, { isLoading, isSuccess }] = useSendLoginMutation();
  const [msgFromServer, setMsgFromServer] = useState(null);
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const res = await sendLogin(data).unwrap();
      const { accessToken, user } = res;

      navigate(-1);
      dispatch(setCredientials({ accessToken, user }));
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-10 shadow-md dark:bg-slate-800 dark:text-white md:w-[36.75rem]">
      <Form onSubmit={handleSubmit(onSubmit)} headingText="Đăng nhập tài khoản">
        {msgFromServer && (
          <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
        )}
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
        <InputGroup>
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            type="password"
            id="password"
            placeholder="Xin hãy nhập mật khẩu của bạn..."
            autoComplete="off"
            disabled={isLoading || isSuccess}
            {...register("password", {
              required: "Vui lòng nhập mật khẩu mật khẩu.",
            })}
          />
          {errors && <InputMsg msg={errors?.password?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="persist">
            <div className="flex items-center gap-2">
              <Input
                id="persist"
                value="persist"
                type="checkbox"
                disabled={isLoading || isSuccess}
                checked={persist}
                onChange={() => setPersist((prev) => !prev)}
              />
              <span>Ghi nhớ đăng nhập</span>
            </div>
          </Label>
        </InputGroup>
        <InputGroup>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link
              to="/forgot"
              className="text-sm transition-all hover:text-violet-700 dark:hover:text-violet-400 md:text-base"
            >
              Quên tài khoản hoặc mật khẩu?
            </Link>
            <Link
              to="/register"
              className="text-sm transition-all hover:text-violet-700 dark:hover:text-violet-400 md:text-base"
            >
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </InputGroup>
        <InputGroup>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link
              to="/send-verify-email"
              className="text-sm transition-all hover:text-violet-700 dark:hover:text-violet-400 md:text-base"
            >
              Không nhận được email xác thực?
            </Link>
          </div>
        </InputGroup>
        <InputGroup>
          <Button
            type="primary"
            component="button"
            disabled={isLoading || !isValid || isSuccess}
            isLoading={isLoading}
          >
            {isLoading ? (
              <span>Đang đăng nhập...</span>
            ) : (
              <span>Đăng nhập</span>
            )}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default LoginForm;
