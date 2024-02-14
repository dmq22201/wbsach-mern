import { REGEX_PHONENUMBER } from "../../utilities/constants";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSendNewShippingAddressMutation } from "./authApiSlice";
import { MdOutlineLocalShipping } from "react-icons/md";

import Form from "../../components/Form";
import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import InputMsg from "../../components/InputMsg";
import Button from "../../components/Button";

function ShippingAddressAddForm({ onCloseModal }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const [sendNewShippingAddress, { isLoading, isSuccess, isError }] =
    useSendNewShippingAddressMutation();

  const [msgFromServer, setMsgFromServer] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      reset({
        address: "",
        phoneNumber: "",
      });
      onCloseModal?.();
    }
  }, [isSuccess]);

  const onSubmit = async (data) => {
    try {
      const res = await sendNewShippingAddress(data).unwrap();
    } catch (err) {
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <>
      <MdOutlineLocalShipping className="mx-auto h-40 w-40 fill-violet-500" />
      <Form
        headingText="Thêm một địa chỉ nhận hàng mới"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isDirty && !isError && !isSuccess && null}
        {!isDirty && !isError && isSuccess && (
          <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
        )}
        {isDirty && isError && !isSuccess && (
          <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
        )}
        <InputGroup>
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            type="text"
            id="address"
            placeholder="Nhập địa chỉ nhận hàng"
            autoComplete="on"
            disabled={isLoading || isSuccess}
            {...register("address", {
              required: "Vui lòng cho địa chỉ nhận hàng mới",
            })}
          />
          {errors && <InputMsg msg={errors?.address?.message} />}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            type="text"
            id="phoneNumber"
            placeholder="Nhập Số điện thoại"
            autoComplete="on"
            disabled={isLoading || isSuccess}
            {...register("phoneNumber", {
              required: "Vui lòng cho số điện thoại",
              pattern: {
                value: REGEX_PHONENUMBER,
                message: "Số điện thoại không hợp lệ. Gồm 10 số VD: 0123456789",
              },
            })}
          />
          {errors && <InputMsg msg={errors?.phoneNumber?.message} />}
        </InputGroup>
        <InputGroup isHorizontal={true} isVertical={false}>
          <Button
            type="success"
            size="md"
            component="button"
            disabled={isLoading || isSuccess}
          >
            Thêm mới
          </Button>
          <Button
            type="outline"
            size="md"
            canSubmit={false}
            component="button"
            disabled={isLoading || isSuccess}
            onClick={() => onCloseModal?.()}
          >
            Hủy bỏ
          </Button>
        </InputGroup>
      </Form>
    </>
  );
}

export default ShippingAddressAddForm;
