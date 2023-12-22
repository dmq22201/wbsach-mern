import { useDispatch, useSelector } from "react-redux";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { selectCurrentUser, setLogout } from "../features/auth/authSlice";
import useDetectMobileDevice from "../hooks/useDetectMobileDevice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "./Theme";
import { EmptyAvatar } from "./Icons";
import {
  HiBars3,
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlineShoppingCart,
  HiOutlinePower,
  HiMiniMagnifyingGlass,
  HiOutlineSun,
  HiMiniMoon,
} from "react-icons/hi2";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Avatar from "./Avatar";
import Input from "./Input";
import Button from "./Button";
import Switch from "./Switch";
import Form from "./Form";
import InputGroup from "./InputGroup";

function Header() {
  const isMobile = useDetectMobileDevice();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { theme, handleTheme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sendLogout] = useSendLogoutMutation();

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      dispatch(setLogout());
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search === "") {
      searchParams.delete("search");
      setSearchParams(searchParams);
    } else {
      navigate(`books/?search=${search}`);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md dark:bg-slate-800 dark:text-white">
      <div className="container">
        <div className="flex h-20 items-center justify-between gap-10">
          <div className="hidden flex-grow md:block">
            <Link className="text-2xl font-medium uppercase" to="/home">
              My Logo
            </Link>
          </div>

          <div className="relative flex flex-grow">
            <Form onSubmit={handleSearch} className="flex flex-grow">
              <InputGroup isHorizontal={true} isVertical={false}>
                <Input
                  placeholder="Tìm kiếm bằng việc gõ tên sách..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <Button component="button" type="primary">
                  <HiMiniMagnifyingGlass className="h-5 w-5" />
                </Button>
              </InputGroup>
            </Form>
          </div>

          {!isMobile ? (
            <div className="flex flex-grow justify-end">
              <Navbar currentUser={currentUser} handleLogout={handleLogout} />
            </div>
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
                        <div className="flex items-center gap-2 p-4 text-xs">
                          {!currentUser.avatar && (
                            <div
                              className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 p-2 dark:bg-gray-600`}
                            >
                              <EmptyAvatar size="xs" />
                            </div>
                          )}
                          {currentUser.avatar && (
                            <Avatar currentUser={currentUser} size="lg" />
                          )}
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
                    <Sidebar.Item toCloseSidebar={false}>
                      <div className="flex w-full justify-between p-4">
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
                    </Sidebar.Item>
                  </div>
                ) : (
                  <div>
                    <Sidebar.Item toCloseSidebar={false}>
                      <div className="flex w-full justify-between p-4">
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
                    </Sidebar.Item>
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
