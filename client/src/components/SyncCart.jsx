import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useEffect } from "react";
import {
  syncCart,
  calcTotalPrice,
  selectCurrentCart,
} from "../features/cart/cartSlice";
import { Outlet } from "react-router-dom";
import { useSendSyncCartMutation } from "../features/auth/authApiSlice";

function SyncCart() {
  const currentUser = useSelector(selectCurrentUser);
  const currentCart = useSelector(selectCurrentCart);
  const dispatch = useDispatch();

  const [sendSyncCart, { isLoading, isSuccess, isError, error }] =
    useSendSyncCartMutation();

  // Mục đích: đồng bộ cart ở localStorage hoặc từ user
  useEffect(() => {
    if (!currentUser) {
      dispatch(
        syncCart({ cart: JSON.parse(localStorage.getItem("cart")) || [] }),
      );
    }

    if (currentUser) {
      dispatch(
        syncCart({
          cart:
            JSON.parse(localStorage.getItem("cart")) || currentUser.cart || [],
        }),
      );

      if (!JSON.parse(localStorage.getItem("cart"))) {
        localStorage.setItem("cart", JSON.stringify(currentUser.cart) || []);
      }
    }

    dispatch(calcTotalPrice());
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentCart) sendSyncCart(currentCart);
  }, [currentUser, currentCart]);
  return <Outlet />;
}

export default SyncCart;
