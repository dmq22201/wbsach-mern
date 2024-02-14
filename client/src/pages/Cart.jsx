import React, { useState } from "react";
import OrderConfirm from "../features/orders/OrderConfirm";
import CartDetails from "../features/cart/CartDetails";

function Cart() {
  const [isOrderConfirm, setIsOrderConfirm] = useState(false);

  return isOrderConfirm ? (
    <OrderConfirm />
  ) : (
    <CartDetails setIsOrderConfirm={setIsOrderConfirm} />
  );
}

export default Cart;
