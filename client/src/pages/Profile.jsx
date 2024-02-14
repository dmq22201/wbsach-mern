import { NavLink, Outlet } from "react-router-dom";
import { useGetProfileQuery } from "../features/auth/authApiSlice";

function Profile() {
  const { data, isFetching, isSuccess } = useGetProfileQuery();

  return (
    <div className="flex min-h-screen w-full flex-col gap-10 divide-y rounded-lg bg-white p-4 dark:divide-slate-700 dark:bg-slate-800 md:p-10 lg:grid lg:grid-cols-[17.625rem,1fr] lg:divide-x lg:divide-y-0">
      <div className="flex flex-shrink-0 snap-x snap-mandatory gap-4 overflow-x-auto lg:flex-col">
        <NavLink
          to="information"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center rounded-lg bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center rounded-lg p-4 transition-all hover:bg-gray-100 dark:hover:bg-slate-700"
          }
        >
          Thông tin chung
        </NavLink>
        <NavLink
          to="security"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center rounded-lg bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center rounded-lg p-4 transition-all hover:bg-gray-100 dark:hover:bg-slate-700"
          }
        >
          Bảo mật tài khoản
        </NavLink>
        <NavLink
          to="favorites"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center rounded-lg bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center rounded-lg p-4 transition-all hover:bg-gray-100 dark:hover:bg-slate-700"
          }
        >
          Danh sách yêu thích
        </NavLink>
        <NavLink
          to="order-history"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center rounded-lg bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center rounded-lg p-4 transition-all hover:bg-gray-100 dark:hover:bg-slate-700"
          }
        >
          Lịch sử mua hàng
        </NavLink>
        <NavLink
          to="shipping-address"
          className={({ isActive }) =>
            isActive
              ? "flex-shrink-0 snap-center rounded-lg bg-violet-500 p-4 text-white"
              : "flex-shrink-0 snap-center rounded-lg p-4 transition-all hover:bg-gray-100 dark:hover:bg-slate-700"
          }
        >
          Danh sách địa chỉ giao hàng
        </NavLink>
      </div>
      <div className="py-20 lg:py-0 lg:pl-12">
        <Outlet />
      </div>
    </div>
  );
}

export default Profile;
