import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import { useGetAllOrdersQuery } from "./orderApiSlice";
import { parseISO } from "date-fns";
import { timeAgo } from "../../utilities/helper";
import { useState } from "react";

function OrderTable() {
  const {
    data: orders,
    isFetching,
    isSuccess,
    isError,
  } = useGetAllOrdersQuery();

  const navigate = useNavigate();

  let content;

  if (isFetching) {
    content = <p>Loading</p>;
  }

  if (isSuccess) {
    content = (
      <Table isActions={true}>
        <Table.Header>
          <Table.HeaderName>Mã đặt hàng</Table.HeaderName>
          <Table.HeaderName>Thời gian</Table.HeaderName>
        </Table.Header>
        <Table.Body>
          {orders.data.toReversed().map((rowData) => (
            <Table.BodyRow
              rowData={{
                name: rowData._id,
                orderDate: timeAgo(parseISO(rowData.orderDate)),
              }}
              key={rowData._id}
            >
              <button
                className="font-semibold text-slate-400 transition-all hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-100"
                onClick={() => {
                  navigate(rowData._id);
                }}
              >
                Xem chi tiết
              </button>
            </Table.BodyRow>
          ))}
        </Table.Body>
      </Table>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span className="font-roboto text-xl font-medium uppercase">
          Lịch sử đặt hàng
        </span>
      </div>
      {content}
    </div>
  );
}

export default OrderTable;
