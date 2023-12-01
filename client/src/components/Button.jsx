import { NavLink, Link } from "react-router-dom";
import { Spinner } from "./Icons";

function Button({
  children,
  type,
  size,
  to,
  component,
  canSubmit = true,
  onClick,
  isLoading = false,
  toCloseModal = false,
  ...props
}) {
  const generalClass =
    "cursor-pointer px-6 py-2 font-medium duration-300 focus:outline-none disabled:cursor-not-allowed flex gap-2 items-center justify-center disabled:bg-gray-200 disabled:text-gray-400 text-xs sm:text-base active:scale-95 transition-all w-auto";

  const types = {
    primary: "text-violet-50 bg-violet-600 hover:bg-violet-700",
    secondary: "",
    success: "text-green-50 bg-green-600 hover:bg-green-700 ",
    warning: "text-orange-50 bg-orange-600 hover:bg-orange-700 ",
    danger: "text-red-50 bg-red-600 hover:bg-red-700 ",
    error: "",
    outline: "text-gray-600 bg-white hover:bg-gray-100 border",
  };

  if (component === "NavLink") {
    return (
      <NavLink to={to} className={`${generalClass} ${types[type]}`} {...props}>
        {children}
      </NavLink>
    );
  }

  if (component === "Link") {
    return (
      <Link to={to} className={`${generalClass} ${types[type]}`} {...props}>
        {children}
      </Link>
    );
  }

  if (component === "button") {
    return (
      <button
        onClick={onClick}
        type={canSubmit ? "submit" : "button"}
        className={`${generalClass} ${types[type]}`}
        {...props}
      >
        {isLoading && <Spinner />}
        {children}
      </button>
    );
  }
}

export default Button;
