import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../features/auth/authSlice";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SpinnerIcon from "./SpinnerIcon";

function PrivateRoute() {
  const userInfo = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const [isLoading, setIsLoading] = useState(true);

  let content;

  useEffect(() => {
    if (token) {
      setIsLoading(false);
    }

    if (!token) {
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    content = <SpinnerIcon size="xl" center={true} />;
  } else if (!token) {
    content = <Navigate replace to="/login" />;
  } else if (token) {
    content = <Outlet />;
  }

  return content;
}

export default PrivateRoute;
