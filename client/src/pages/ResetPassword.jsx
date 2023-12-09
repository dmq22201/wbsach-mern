import { useParams, Navigate } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useGetVerifyPasswordResetTokenQuery } from "../features/auth/authApiSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import ResetPasswordForm from "../features/auth/ResetPasswordForm";
import SpinnerIcon from "../components/SpinnerIcon";
import MsgPage from "../components/MsgPage";

function ResetPassword() {
  const params = useParams();
  const { passwordResetToken } = params;

  const {
    data: res,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetVerifyPasswordResetTokenQuery(passwordResetToken);

  const currentUser = useSelector(selectCurrentUser);
  const [msgFromServer, setMsgFromServer] = useState(null);

  useEffect(() => {
    if (isError) {
      setMsgFromServer({
        status: error.data?.status,
        message: error.data?.message,
      });
    }
  }, [isError]);

  let content;

  if (isFetching) {
    content = <SpinnerIcon size="lg" center />;
  } else if (isSuccess) {
    content = <ResetPasswordForm />;
  } else if (isError && msgFromServer) {
    content = <MsgPage msgFromServer={msgFromServer} />;
  } else if (currentUser) {
    content = <Navigate to="/home" replace />;
  }

  return content;
}

export default ResetPassword;
