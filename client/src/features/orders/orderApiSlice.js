import { apiSlice } from "../api/apiSlice";

const orderApislice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOrder: builder.mutation({
      query: (order) => ({
        url: "/api/v1/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Orders"],
    }),
    getAllOrders: builder.query({
      query: () => `/api/v1/orders`,
      providesTags: ["Orders"],
    }),
    getOrderDetail: builder.query({
      query: (id) => `/api/v1/orders/${id}`,
    }),
  }),
});

export const {
  useSendOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailQuery,
} = orderApislice;
