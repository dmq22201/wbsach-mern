import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../features/auth/authSlice";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
  const userInfo = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  return !userInfo || !token ? <Navigate replace to="/login" /> : <Outlet />;
}

export default PrivateRoute;
