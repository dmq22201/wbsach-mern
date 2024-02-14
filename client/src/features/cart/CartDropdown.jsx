import {
  createContext,
  useState,
  useContext,
  cloneElement,
  Children,
} from "react";
import useCloseWhenClickOutSide from "../../hooks/useCloseWhenClickOutSide";

const CartDropdownContext = createContext();

function CartDropdown({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Ta không thể set cứng vị trí được nên ta cần sử dụng state tính toán vị trí menu xuất hiện
  const [position, setPosition] = useState(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const ref = useCloseWhenClickOutSide(() => {
    close();
  }, true);

  return (
    <CartDropdownContext.Provider
      value={{ open, close, isOpen, position, setPosition }}
    >
      <div className="relative" ref={ref}>
        {children}
      </div>
    </CartDropdownContext.Provider>
  );
}

function Toggle({ children, className }) {
  const { open, close, isOpen, setPosition } = useContext(CartDropdownContext);

  const handleClick = (e) => {
    e.stopPropagation();

    const rect = e.target.closest("button").getBoundingClientRect("button");

    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 1,
    });

    if (isOpen) close();
    else open();
  };

  const customClass = className;

  return (
    <button
      onClick={handleClick}
      className={`${customClass} flex items-center gap-2`}
    >
      {children}
    </button>
  );
}

function CartDropdownContent({ children, size }) {
  const { isOpen } = useContext(CartDropdownContext);

  if (!isOpen) return null;

  return (
    <div
      className={`absolute mt-5 ${size} right-0 z-10 divide-y rounded-lg bg-white shadow-2xl dark:divide-slate-700 dark:bg-slate-700`}
    >
      {children}
    </div>
  );
}

function Items({ children }) {
  return (
    <div className="flex max-h-[40vh] flex-col justify-between overflow-auto">
      {children}
    </div>
  );
}

function Item({ children }) {
  const { close } = useContext(CartDropdownContext);
  return (
    <div className="flex-grow" onClick={close}>
      {children}
    </div>
  );
}

function Action({ children }) {
  return <div className="flex items-center gap-6 p-4">{children}</div>;
}

function Footer({ children }) {
  return <div className="rounded-b-lg p-4">{children}</div>;
}

function ActionFooter({ children }) {
  const { close } = useContext(CartDropdownContext);
  return (
    <div className="ml-auto flex gap-6">
      {Children.map(children, (child) => {
        return cloneElement(child, {
          onClick: close,
        });
      })}
    </div>
  );
}

CartDropdown.Toggle = Toggle;
CartDropdown.CartDropdownContent = CartDropdownContent;
CartDropdown.Items = Items;
CartDropdown.Item = Item;
CartDropdown.Action = Action;
CartDropdown.Footer = Footer;
CartDropdown.ActionFooter = ActionFooter;

export default CartDropdown;
