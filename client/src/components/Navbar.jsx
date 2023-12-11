import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlinePower,
  HiMiniMoon,
  HiOutlineSun,
} from "react-icons/hi2";
import { EmptyAvatar } from "./Icons";

import Button from "./Button";
import Avatar from "./Avatar";
import Menu from "./Menu";
import Switch from "./Switch";
import { useContext } from "react";
import { ThemeContext } from "./Theme";

function Navbar({ currentUser, handleLogout }) {
  const navigate = useNavigate();
  const { theme, handleTheme } = useContext(ThemeContext);

  return (
    <nav className="flex h-20 items-center justify-between gap-6">
      {currentUser ? (
        <>
          <div className="flex flex-col justify-center">
            <div className="relative flex cursor-pointer items-center">
              <Menu>
                <Menu.Toggle id="navbar-menu">
                  <div className="flex items-center gap-2 leading-[5rem]">
                    {!currentUser.avatar ? (
                      <EmptyAvatar size="md" />
                    ) : (
                      <Avatar currentUser={currentUser} size="md" />
                    )}
                    <span className="font-semibold capitalize text-gray-400 transition-colors hover:text-black dark:hover:text-white">
                      {currentUser.fullName}
                    </span>
                  </div>
                </Menu.Toggle>
                <Menu.List id="navbar-menu" size="w-60">
                  <div>
                    <Menu.Item>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 rounded-t-lg p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        <HiOutlineUserCircle className="h-4 w-4" />
                        Chỉnh sửa hồ sơ
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to="/profile/security"
                        className="flex items-center gap-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        <HiOutlineLockClosed className="h-4 w-4" />
                        Bảo mật
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to="/profile/order-history"
                        className="flex items-center gap-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        <HiOutlineClock className="h-4 w-4" />
                        Lịch sử mua hàng
                      </Link>
                    </Menu.Item>
                    <Menu.Item toCloseMenu={false}>
                      <div className="flex items-center gap-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-700">
                        <div className="flex w-full justify-between">
                          <div className="flex items-center gap-2">
                            {theme === "light" ? (
                              <HiOutlineSun className="h-4 w-4" />
                            ) : (
                              <HiMiniMoon className="h-4 w-4 text-yellow-500" />
                            )}
                            <span>
                              Giao diện: {theme === "dark" ? "Tối" : "Sáng"}
                            </span>
                          </div>
                          <Switch handleFn={handleTheme} val={theme} />
                        </div>
                        <div>
                          <label
                            htmlFor="toggleDarkMode"
                            className="relative h-10 w-20 rounded-full bg-gray-100"
                          ></label>
                        </div>
                      </div>
                    </Menu.Item>
                  </div>
                  <div>
                    <Menu.Item>
                      <button
                        className="flex w-full items-center gap-2 rounded-b-lg p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
                        onClick={handleLogout}
                      >
                        <HiOutlinePower className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.List>
              </Menu>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-6">
          <Button to="/login" component="Link" type="primary">
            Đăng nhập
          </Button>
          <Button to="/register" component="Link" type="outline">
            Đăng ký
          </Button>
          <button onClick={handleTheme}>
            {theme === "light" ? (
              <HiOutlineSun className="h-6 w-6" />
            ) : (
              <HiMiniMoon className="h-6 w-6 text-yellow-500" />
            )}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
