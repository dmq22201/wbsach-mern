import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineLockClosed,
  HiOutlinePower,
  HiMiniMoon,
  HiOutlineSun,
  HiOutlineShoppingCart,
  HiOutlineTrash,
} from "react-icons/hi2";
import { useContext, useEffect } from "react";
import { ThemeContext } from "./Theme";
import { useDispatch, useSelector } from "react-redux";
import {
  calcTotalPrice,
  removeBook,
  selectCurrentCart,
  selectTotalPrice,
  updateQuantity,
} from "../features/cart/cartSlice";
import { formatCurrency } from "../utilities/helper";
import { EmptyAvatar } from "./Icons";

import Button from "./Button";
import Avatar from "./Avatar";
import Menu from "./Menu";
import Switch from "./Switch";
import CartDropdown from "../features/cart/CartDropdown";

function Navbar({ currentUser, handleLogout }) {
  const navigate = useNavigate();
  const { theme, handleTheme } = useContext(ThemeContext);
  const currentCart = useSelector(selectCurrentCart);

  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (item, newQuantity) => {
    dispatch(updateQuantity({ idBook: item._id, newQuantity }));
    dispatch(calcTotalPrice());
  };

  return (
    <nav className="flex h-20 items-center justify-between gap-10">
      <div>
        <CartDropdown>
          <CartDropdown.Toggle className="relative rounded-full p-4 transition-all hover:bg-slate-100 hover:dark:bg-slate-700">
            {currentCart.length !== 0 && (
              <div className="absolute -right-2 top-0 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
                {currentCart.length}
              </div>
            )}
            <HiOutlineShoppingCart className="text-xl" />
          </CartDropdown.Toggle>
          <CartDropdown.CartDropdownContent size="w-[28rem]">
            <CartDropdown.Items>
              {currentCart.length !== 0 ? (
                currentCart.map((item) => (
                  <div key={item._id} className="flex">
                    <CartDropdown.Item>
                      <div className="flex items-center justify-between rounded-lg p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-600">
                        <Link
                          className="flex max-w-[14rem] items-center gap-6 text-xs md:text-base"
                          to={`/books/${item.slug}`}
                        >
                          <div>
                            <img
                              src={item.coverImage}
                              className="h-[56px] min-w-[56px] rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="truncate-two-row text-sm">
                              {item.name}
                            </p>
                            <p className="text-sm font-semibold text-red-500 dark:text-red-400">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </CartDropdown.Item>
                    <CartDropdown.Action>
                      <div className="flex items-center gap-6 border-2 text-xs dark:border-slate-500">
                        <button
                          className="border-2 border-b-0 border-l-0 border-t-0 p-2 hover:bg-slate-100 dark:border-slate-500 dark:hover:bg-slate-600"
                          onClick={() => {
                            if (item.quantity === 10) return;
                            handleUpdateQuantity(item, item.quantity + 1);
                          }}
                        >
                          +
                        </button>
                        <p className="font-bold">{item.quantity}</p>
                        <button
                          className="border-2 border-b-0 border-r-0 border-t-0 p-2 hover:bg-slate-100 dark:border-slate-500 dark:hover:bg-slate-600"
                          onClick={() => {
                            if (item.quantity === 1) return;
                            handleUpdateQuantity(item, item.quantity - 1);
                          }}
                        >
                          -
                        </button>
                      </div>
                      <div className="justify-self-end">
                        <button
                          className="ml-auto text-xl font-bold transition-all hover:text-red-500"
                          onClick={() => {
                            dispatch(removeBook({ idBook: item._id }));
                            dispatch(calcTotalPrice());
                          }}
                        >
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </CartDropdown.Action>
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center p-6">
                  <CartDropdown.Item>
                    <p>
                      Hiện tại chưa có sản phẩm nào 😢.
                      <Link
                        to="/books"
                        className="underline transition-all hover:text-blue-500"
                      >
                        Tiếp tục mua sắm
                      </Link>
                    </p>
                  </CartDropdown.Item>
                </div>
              )}
            </CartDropdown.Items>

            {currentCart.length !== 0 && (
              <CartDropdown.Footer>
                <div className="flex flex-col gap-6">
                  <div className="ml-auto flex gap-6">
                    <p className="font-semibold">Tổng tiền: </p>
                    <span className="font-semibold text-red-500 dark:text-red-400">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <CartDropdown.ActionFooter>
                    <Button type="outline" component="Link" to={`/cart`}>
                      Xem chi tiết
                    </Button>
                  </CartDropdown.ActionFooter>
                </div>
              </CartDropdown.Footer>
            )}
          </CartDropdown.CartDropdownContent>
        </CartDropdown>
      </div>
      {currentUser ? (
        <>
          <div className="flex flex-col justify-center">
            <div className="relative flex cursor-pointer items-center">
              <Menu>
                <Menu.Toggle id="navbar-menu">
                  <div className="flex items-center gap-2 leading-[5rem]">
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
                        className="flex items-center gap-2 rounded-t-lg p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-600"
                      >
                        <HiOutlineUserCircle className="h-4 w-4" />
                        Chỉnh sửa hồ sơ
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to="/profile/security"
                        className="flex items-center gap-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-600"
                      >
                        <HiOutlineLockClosed className="h-4 w-4" />
                        Bảo mật
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to="/profile/order-history"
                        className="flex items-center gap-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-600"
                      >
                        <HiOutlineClock className="h-4 w-4" />
                        Lịch sử mua hàng
                      </Link>
                    </Menu.Item>
                    <Menu.Item toCloseMenu={false}>
                      <div className="flex items-center gap-2 p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-600">
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
                        {/* <div>
                          <label
                            htmlFor="toggleDarkMode"
                            className="relative h-10 w-20 rounded-full bg-gray-100"
                          ></label>
                        </div> */}
                      </div>
                    </Menu.Item>
                  </div>
                  <div>
                    <Menu.Item>
                      <button
                        className="flex w-full items-center gap-2 rounded-b-lg p-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-600"
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
