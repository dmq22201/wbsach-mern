import { useSendUpdateInfoMutation } from "./authApiSlice";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { REGEX_FULLNAME, REGEX_PHONENUMBER } from "../../utilities/constants";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";

import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Button from "../../components/Button";
import InputMsg from "../../components/InputMsg";
import Form from "../../components/Form";

function InformationForm() {
  const currentUser = useSelector(selectCurrentUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      fullName: currentUser.fullName,
      phoneNumber: currentUser.phoneNumber,
      gender: currentUser.gender,
    },
    mode: "onChange",
  });

  const [sendUpdateInfo, { isLoading, isSuccess, isError }] =
    useSendUpdateInfoMutation();

  const [msgFromServer, setMsgFromServer] = useState(null);

  useEffect(() => {
    if (currentUser && isSuccess) {
      reset({
        fullName: currentUser.fullName,
        phoneNumber: currentUser.phoneNumber,
        gender: currentUser.gender,
      });
    }
  }, [currentUser, isSuccess]);

  const onSubmit = async (data) => {
    try {
      const res = await sendUpdateInfo(data).unwrap();

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
        Thông tin cá nhân
      </span>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label htmlFor="fullName">Họ tên</Label>
          <Input
            type="text"
            id="fullName"
            placeholder="Nhập họ tên của bạn"
            autoComplete="on"
            disabled={isLoading}
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
            disabled={isLoading}
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
          <span className="font-medium">Giới tính</span>
          <div className="flex w-fit items-center gap-6">
            <Label htmlFor="male">
              <div className="flex items-center gap-2">
                <Input
                  id="male"
                  value="Nam"
                  type="radio"
                  {...register("gender")}
                />
                <span className="text-sm sm:text-base">Nam</span>
              </div>
            </Label>
            <Label htmlFor="female">
              <div className="flex items-center gap-2">
                <Input
                  id="female"
                  value="Nữ"
                  type="radio"
                  {...register("gender")}
                />
                <span className="text-sm sm:text-base">Nữ</span>
              </div>
            </Label>
            <Label htmlFor="private">
              <div className="flex items-center gap-2">
                <Input
                  id="private"
                  value="Không tiết lộ"
                  type="radio"
                  {...register("gender")}
                />
                <span className="text-sm sm:text-base">Không tiết lộ</span>
              </div>
            </Label>
          </div>
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
              <span>Cập nhật thông tin</span>
            )}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default InformationForm;
