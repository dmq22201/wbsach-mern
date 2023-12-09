import { useDispatch, useSelector } from "react-redux";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { selectCurrentUser, setLogout } from "../features/auth/authSlice";
import useDetectMobileDevice from "../hooks/useDetectMobileDevice";
import { Link, NavLink } from "react-router-dom";

import {
  HiBars3,
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlineShoppingCart,
  HiOutlinePower,
  HiMiniMagnifyingGlass,
} from "react-icons/hi2";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Avatar from "./Avatar";
import Form from "./Form";
import Input from "./Input";
import Button from "./Button";
import InputGroup from "./InputGroup";

function Header() {
  const isMobile = useDetectMobileDevice();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const [sendLogout] = useSendLogoutMutation();

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      dispatch(setLogout());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md dark:bg-slate-800 dark:text-white">
      <div className="container">
        <div className="flex h-20 items-center justify-between gap-10">
          <Link className="text-2xl font-medium uppercase" to="/home">
            My Logo
          </Link>

          {!isMobile ? (
            <>
              <Navbar currentUser={currentUser} handleLogout={handleLogout} />
            </>
          ) : (
            <Sidebar>
              <Sidebar.Toggle>
                <HiBars3 className="h-8 w-8" />
              </Sidebar.Toggle>
              <Sidebar.Content>
                {currentUser ? (
                  <div>
                    <Sidebar.Item hasDropdown={true}>
                      <Sidebar.DropdownToggle>
                        <div className="flex items-center gap-2 p-4 text-sm sm:text-base">
                          <Avatar currentUser={currentUser} size="md" />
                          <span className="font-semibold capitalize">
                            {currentUser.fullName}
                          </span>
                        </div>
                      </Sidebar.DropdownToggle>

                      <Sidebar.DropdownContent>
                        <Sidebar.DropdownItem>
                          <Link to="/profile">
                            <div className="flex items-center gap-2 p-4 pl-6 text-xs sm:text-base">
                              <HiOutlineUserCircle className="h-4 w-4" />
                              <span>Chỉnh sửa hồ sơ</span>
                            </div>
                          </Link>
                        </Sidebar.DropdownItem>
                        <Sidebar.DropdownItem>
                          <Link to="/profile/order-history">
                            <div className="flex items-center gap-2 p-4 pl-6 text-xs sm:text-base">
                              <HiOutlineClock className="h-4 w-4" />
                              <span>Lịch sử mua hàng</span>
                            </div>
                          </Link>
                        </Sidebar.DropdownItem>
                        <Sidebar.DropdownItem>
                          <Link to="/profile/security">
                            <div className="flex items-center gap-2 p-4 pl-6 text-xs sm:text-base">
                              <HiOutlineLockClosed className="h-4 w-4" />
                              <span>Bảo mật tài khoản</span>
                            </div>
                          </Link>
                        </Sidebar.DropdownItem>
                      </Sidebar.DropdownContent>
                    </Sidebar.Item>

                    <Sidebar.Item>
                      <Link to="/profile/security">
                        <div className="flex items-center gap-2 p-4 text-xs sm:text-base">
                          <HiOutlineShoppingCart className="h-4 w-4" />
                          <span>Giỏ hàng:</span>
                          <span className="font-semibold text-red-500 dark:text-red-400">
                            6
                          </span>
                        </div>
                      </Link>
                    </Sidebar.Item>
                  </div>
                ) : (
                  <div>
                    <Sidebar.Item>
                      <Link to="/login" className="block w-full p-4">
                        Đăng nhập
                      </Link>
                    </Sidebar.Item>
                    <Sidebar.Item>
                      <Link to="/register" className="block w-full p-4">
                        Đăng ký
                      </Link>
                    </Sidebar.Item>
                  </div>
                )}
                <div>
                  <Sidebar.Item>
                    <Link to="/home" className="block w-full p-4">
                      Trang chủ
                    </Link>
                  </Sidebar.Item>
                  <Sidebar.Item>
                    <Link to="/login" className="block w-full p-4">
                      Sách
                    </Link>
                  </Sidebar.Item>
                  <Sidebar.Item>
                    <Link to="/genres" className="block w-full p-4">
                      Thể loại
                    </Link>
                  </Sidebar.Item>
                </div>
                {currentUser && (
                  <div className="mt-auto">
                    <Sidebar.Item>
                      <button
                        className="flex w-full items-center gap-2 p-4"
                        onClick={handleLogout}
                      >
                        <HiOutlinePower className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </Sidebar.Item>
                  </div>
                )}
              </Sidebar.Content>
            </Sidebar>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
