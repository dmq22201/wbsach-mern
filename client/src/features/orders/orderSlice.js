import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  information: {
    fullName: "",
    phoneNumber: "",
    email: "",
    shippingAddress: "",
    paymentMethod: "",
  },
  order: {
    items: [],
    totalPrice: 0,
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setInformation: (state, action) => {
      state.information = {
        ...state.information,
        ...action.payload,
      };
    },
    setOrder: (state, action) => {
      const { items, totalPrice } = action.payload;
      state.order.items = items;
      state.order.totalPrice = totalPrice;
    },
    setPaymentMethod: (state, action) => {
      const { paymentMethod } = action.payload;
      state.paymentMethod = paymentMethod;
    },
    clearOrderState: (state, action) => {
      state.information = {
        fullName: "",
        phoneNumber: "",
        email: "",
        shippingAddress: "",
        paymentMethod: "",
      };

      state.order = {
        items: [],
        totalPrice: 0,
      };
    },
  },
});

export const selectCurrentOrder = (state) => state.order;
export const selectCurrentInformation = (state) => state.order.information;
export const selectCurrentPaymentMethod = (state) =>
  state.order.information.paymentMethod;

export const { setInformation, setOrder, setPaymentMethod, clearOrderState } =
  orderSlice.actions;

export default orderSlice.reducer;
