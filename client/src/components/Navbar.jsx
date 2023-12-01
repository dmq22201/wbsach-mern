import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlinePower,
} from "react-icons/hi2";

import Button from "./Button";
import Avatar from "./Avatar";
import Menu from "./Menu";
import { EmptyAvatar } from "./Icons";

function Navbar({ currentUser, handleLogout }) {
  const navigate = useNavigate();

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
                      <EmptyAvatar size="xs" />
                    ) : (
                      <Avatar currentUser={currentUser} size="md" />
                    )}
                    <span className="font-semibold text-gray-400 transition-colors hover:text-gray-950">
                      {currentUser.fullName}
                    </span>
                  </div>
                </Menu.Toggle>
                <Menu.List id="navbar-menu" size="w-60">
                  <div>
                    <Menu.Item>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 rounded-t-xl p-4 transition-colors hover:bg-gray-50"
                      >
                        <HiOutlineUserCircle className="h-4 w-4" />
                        Chỉnh sửa hồ sơ
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to="/profile/security"
                        className="flex items-center gap-2 p-4 transition-colors hover:bg-gray-50"
                      >
                        <HiOutlineLockClosed className="h-4 w-4" />
                        Bảo mật
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to="/profile/order-history"
                        className="flex items-center gap-2 p-4 transition-colors hover:bg-gray-50"
                      >
                        <HiOutlineClock className="h-4 w-4" />
                        Lịch sủ mua hàng
                      </Link>
                    </Menu.Item>
                  </div>
                  <div>
                    <Menu.Item>
                      <button
                        className="flex w-full items-center gap-2 rounded-b-xl p-4 transition-colors hover:bg-gray-50"
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
        </div>
      )}
    </nav>
  );
}

export default Navbar;
