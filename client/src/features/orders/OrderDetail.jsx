import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderDetailQuery } from "./orderApiSlice";
import OrderItem from "./OrderItem";
import { formatCurrency, timeAgo } from "../../utilities/helper";
import { parseISO } from "date-fns";
import Button from "../../components/Button";

function OrderDetail() {
  const { id } = useParams();
  const {
    data: order,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetOrderDetailQuery(id);

  const navigate = useNavigate();

  let content;

  if (isFetching) {
    content = <p>Loading</p>;
  }

  if (isSuccess) {
    content = (
      <div className="flex flex-col gap-6">
        <div className="flex max-h-[40vh] flex-col gap-12 overflow-auto rounded-lg">
          {order.data.order.items.map((item) => (
            <OrderItem item={item} key={item._id} />
          ))}
        </div>
        <div>
          <div>
            <p className="font-semibold">
              Tổng số tiền:{" "}
              <span className="text-red-500 dark:text-red-400">
                {formatCurrency(order.data.order.totalPrice)}
              </span>
            </p>
            <p className="font-semibold">
              Phương thức giao dịch:{" "}
              <span className="text-red-500 dark:text-red-400">
                {order.data.information.paymentMethod === "directTransaction"
                  ? "Thanh toán khi nhận hàng"
                  : "Chuyển khoản ngân hàng"}
              </span>
            </p>
            <p className="font-semibold">
              Ngày giao dịch:{" "}
              <span className="text-red-500 dark:text-red-400">
                <span className="font-semibold italic">
                  {timeAgo(parseISO(order.data.orderDate))}
                </span>
              </span>
            </p>
          </div>
          <div>
            <p className="font-semibold">
              Người nhận:{" "}
              <span className="text-red-500 dark:text-red-400">
                {order.data.information.fullName}
              </span>
            </p>
            <p className="font-semibold">
              Số điện thoại:{" "}
              <span className="text-red-500 dark:text-red-400">
                {order.data.information.phoneNumber}
              </span>
            </p>
            <p className="font-semibold">
              Địa chỉ:{" "}
              <span className="text-red-500 dark:text-red-400">
                {order.data.information.shippingAddress}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span className="font-roboto text-xl font-medium uppercase">
          Chi tiết đơn hàng
        </span>
      </div>
      {content}
      <div className="ml-auto">
        <Button type="outline" component="button" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    </div>
  );
}

export default OrderDetail;
