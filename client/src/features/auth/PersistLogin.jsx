import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useGetRefreshTokenMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import SpinnerIcon from "../../components/SpinnerIcon";

const PersistLogin = () => {
  const [persist] = usePersist(); // lấy giá trị persist. Giá trị là gì tùy thuộc vào initial State trong custom hook

  const token = useSelector(selectCurrentToken); // lấy access token hiện tại
  const [msgFromServer, setMsgFromServer] = useState(null);
  const effectRan = useRef(false); // xủ lý useEffect chạy 2 lần trong strict mode

  const [sendRefreshToken, { isLoading, isSuccess, isError, isUninitialized }] =
    useGetRefreshTokenMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        try {
          await sendRefreshToken().unwrap();
          setTrueSuccess(true);
        } catch (err) {
          setMsgFromServer({
            status: err.data?.status,
            message: err.data?.message,
          });
        }
      };

      if (!token && persist) verifyRefreshToken(); // nếu không có token và chỉ có persist = true thì ta gọi hàm fetch refresh token
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    // ghi nhớ đăng nhập: không
    content = <Outlet />;
  } else if (isLoading) {
    // ghi nhớ đăng nhập có nhưng token: đang được fetching
    content = <SpinnerIcon size="xl" center={true} />;
  } else if (persist && !token) {
    // ghi nhớ đăng nhập: có nhưng token: không có
    content = <Outlet />;
  } else if (persist && isSuccess) {
    // ghi nhớ đăng nhập có nhưng token: fetch thành công
    content = <Outlet />;
  } else if (persist && isError) {
    // ghi nhớ đăng nhập có nhưng token: bị lỗi
    content = <Outlet />;
  } else if (persist && token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
