import { NavLink, Link } from "react-router-dom";
import { Spinner } from "./Icons";

function Button({
  children,
  type,
  to,
  component,
  canSubmit = true,
  isLoading = false,
  Icon,
  disabled,
  isRoundedFull = false,
  ...props
}) {
  const generalClass = `cursor-pointer px-6 py-2 font-medium focus:outline-none disabled:cursor-not-allowed flex gap-2 items-center justify-center text-xs md:text-base  transition-all w-fit flex items-center gap-2 ${
    isRoundedFull ? "rounded-full px-2 py-2" : "rounded-lg"
  }`;

  const types = {
    primary:
      "text-violet-50 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-500 disabled:text-violet-300",
    secondary: "",
    success:
      "text-green-50 bg-green-600 hover:bg-green-700 disabled:bg-green-500 disabled:text-green-300",
    warning:
      "text-orange-50 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-500 disabled:text-orange-300",
    danger:
      "text-red-50 bg-red-600 hover:bg-red-700 disabled:bg-red-500 disabled:text-red-300",
    error: "",
    outline:
      "bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700",
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
        disabled={disabled}
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
