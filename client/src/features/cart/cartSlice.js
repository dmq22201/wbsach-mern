import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  totalPrice: 0,
  paymentMethod: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    syncCart: (state, action) => {
      const { cart } = action.payload;
      state.cart = cart;
    },
    addBook: (state, action) => {
      const { book, quantity } = action.payload;

      // Tìm vị trí item có tồn tại trong danh sách cart không?
      const existingIndex = state.cart.findIndex(
        (item) => item._id.toString() === book._id.toString(),
      );

      if (existingIndex === -1) {
        // Nếu không tìm thấy, thêm một phần tử mới
        state.cart.push({ ...book, quantity });
      } else {
        // Nếu đã tồn tại, cập nhật phần tử đã có
        state.cart[existingIndex] = { ...book, quantity };
      }

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeBook: (state, action) => {
      const { idBook } = action.payload;
      state.cart = state.cart.filter(
        (book) => book._id.toString() !== idBook.toString(),
      );

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    updateQuantity: (state, action) => {
      const { idBook, newQuantity } = action.payload;
      const result = state.cart.map((book, index) =>
        idBook === book._id.toString()
          ? (state.cart[index] = { ...book, quantity: newQuantity })
          : book,
      );

      state.cart = result;

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    calcTotalPrice: (state, action) => {
      if (state.cart.length !== 0) {
        const calc = state.cart.reduce((acc, curr) => {
          return acc + curr.price * curr.quantity;
        }, 0);

        state.totalPrice = calc;
      } else {
        state.totalPrice = 0;
      }
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    clearCart: (state, action) => {
      state.cart = [];
      state.totalPrice = 0;
      state.paymentMethod = "";
    },
  },
});

//export const selectCurrentCart = (state) => state.cart.cart;

const selectCart = (state) => state.cart.cart;
export const selectCurrentCart = createSelector([selectCart], (cart) => cart);

export const selectTotalPrice = (state) => state.cart.totalPrice;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;

export const {
  syncCart,
  addBook,
  removeBook,
  updateQuantity,
  calcTotalPrice,
  setPaymentMethod,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
