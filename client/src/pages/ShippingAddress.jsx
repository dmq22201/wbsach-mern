import ShippingAddressButton from "../features/auth/ShippingAddressButton";
import ShippingAddressTable from "../features/auth/ShippingAddressTable";

function ShippingAddress() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span className="font-roboto text-xl font-medium uppercase">
          Danh sách địa chỉ giao hàng
        </span>
        <span>
          (Đây là các nơi lưu vị trí mà bạn muốn nhận hàng, tiện cho việc đỡ
          phải nhập địa chỉ mỗi khi đặt đơn.
          <span className="font-semibold text-red-500 dark:text-red-600">
            Tối đa 4 địa chỉ
          </span>
          )
        </span>
      </div>

      <ShippingAddressButton />
      <ShippingAddressTable />
    </div>
  );
}

export default ShippingAddress;
