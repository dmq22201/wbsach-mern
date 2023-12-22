import { REGEX_PHONENUMBER } from "../../utilities/constants";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSendUpdateShippingAddressMutation } from "./authApiSlice";
import { MdOutlineLocalShipping } from "react-icons/md";

import Form from "../../components/Form";
import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Input from "../../components/Input";
import InputMsg from "../../components/InputMsg";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";

function ShippingAddressEditForm({ rowData, onCloseModal }) {
  // const currentUser = useSelector(selectCurrentUser);

  const currentId = rowData._id;
  const currentAddress = rowData.address;
  const currentPhoneNumber = rowData.phoneNumber;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      address: currentAddress,
      phoneNumber: currentPhoneNumber,
    },
  });

  const [sendUpdateShippingAddress, { isLoading, isSuccess, isError }] =
    useSendUpdateShippingAddressMutation();

  const [msgFromServer, setMsgFromServer] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      onCloseModal?.();
    }
  }, [isSuccess]);

  const onSubmit = async (data) => {
    try {
      const dataUpdate = {
        ...data,
        _id: currentId,
      };
      const res = await sendUpdateShippingAddress(dataUpdate).unwrap();
    } catch (err) {
      console.log(err);
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
        headingText="Sửa địa chỉ nhận hàng"
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
            Lưu lại
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

export default ShippingAddressEditForm;
