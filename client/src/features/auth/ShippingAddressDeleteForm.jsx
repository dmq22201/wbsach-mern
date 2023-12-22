import Form from "../../components/Form";
import InputGroup from "../../components/InputGroup";
import InputMsg from "../../components/InputMsg";
import Button from "../../components/Button";
import { HiOutlineTrash } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSendDeleteShippingAddressMutation } from "./authApiSlice";

function ShippingAddressDeleteForm({ rowData, onCloseModal }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const [msgFromServer, setMsgFromServer] = useState(null);

  const [sendDeleteShippingAddress, { isLoading, isSuccess, isError }] =
    useSendDeleteShippingAddressMutation();

  useEffect(() => {
    if (isSuccess) {
      onCloseModal?.();
    }
  }, [isSuccess]);

  const onSubmit = async () => {
    try {
      await sendDeleteShippingAddress(rowData).unwrap();
    } catch (err) {
      console.log(err);
      setMsgFromServer({
        status: err.data?.status,
        message: err.data?.message,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <HiOutlineTrash className="mx-auto h-40 w-40 text-red-500" />
      <Form
        headingText="Xóa một địa chỉ giao hàng"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isDirty && !isError && !isSuccess && null}
        {!isDirty && !isError && isSuccess && (
          <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
        )}
        {isDirty && isError && !isSuccess && (
          <InputMsg msgFromServer={msgFromServer} isFromServer={true} />
        )}

        <span className="border p-2 font-semibold dark:text-white">
          Địa chỉ: {rowData.address} - Số điện thoại: {rowData.phoneNumber}
        </span>
        <InputGroup isHorizontal={true} isVertical={false}>
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
            disabled={isLoading || isSuccess}
            onClick={() => onCloseModal?.()}
          >
            Hủy bỏ
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default ShippingAddressDeleteForm;
