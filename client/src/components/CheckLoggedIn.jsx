import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Navigate, Outlet } from "react-router-dom";

function CheckLoggedIn() {
  const currentUser = useSelector(selectCurrentUser);

  return currentUser ? <Navigate to="/books" replace /> : <Outlet />;
}

export default CheckLoggedIn;
