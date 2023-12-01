import { NavLink, Outlet } from "react-router-dom";
import { useGetProfileQuery } from "../features/auth/authApiSlice";

function Profile() {
  const { data, isFetching, isSuccess } = useGetProfileQuery(undefined, {
    pollingInterval: 5000,
  });

  return (
    <div className="flex min-h-screen w-full flex-col gap-20 divide-y bg-white p-8 lg:grid lg:grid-cols-[17.625rem,1fr] lg:divide-x lg:divide-y-0">
      <div className="flex flex-shrink-0 snap-x snap-mandatory gap-4 overflow-x-auto lg:flex-col">
        <NavLink
          to="information"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center p-4 transition-all hover:bg-gray-100"
          }
        >
          Thông tin chung
        </NavLink>
        <NavLink
          to="security"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center p-4 transition-all hover:bg-gray-100"
          }
        >
          Bảo mật tài khoản
        </NavLink>
        <NavLink
          to="shipping-address"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center p-4 transition-all hover:bg-gray-100"
          }
        >
          Danh sách địa chỉ nhận hàng
        </NavLink>
        <NavLink
          to="order-history"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center p-4 transition-all hover:bg-gray-100"
          }
        >
          Lịch sử mua hàng
        </NavLink>
      </div>
      <div className="py-20 lg:py-0 lg:pl-20">
        <Outlet />
      </div>
    </div>
  );
}

export default Profile;
