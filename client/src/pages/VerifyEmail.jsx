import { useEffect, useState } from "react";
import MiniNotFound from "../components/MsgPage";
import SpinnerIcon from "../components/SpinnerIcon";
import { useGetVerifyEmailTokenQuery } from "../features/auth/authApiSlice";
import { useParams } from "react-router-dom";
import MsgPage from "../components/MsgPage";

function VerifyEmail() {
  const params = useParams();
  const { emailVerifyToken } = params;

  const {
    data: res,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetVerifyEmailTokenQuery(emailVerifyToken);
  const [msgFromServer, setMsgFromServer] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      setMsgFromServer(res);
    }

    if (isError) {
      setMsgFromServer({
        status: error.data?.status,
        message: error.data?.message,
      });
    }
  }, [isSuccess, isError]);

  let content;

  if (isLoading) {
    content = <SpinnerIcon size="lg" center />;
  } else if (isSuccess && msgFromServer) {
    content = <MsgPage msgFromServer={msgFromServer} />;
  } else if (isError && msgFromServer) {
    content = <MsgPage msgFromServer={msgFromServer} />;
  }

  return content;
}

export default VerifyEmail;
