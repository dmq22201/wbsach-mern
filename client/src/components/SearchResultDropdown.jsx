import { cloneElement, createContext, useContext, useState } from "react";
import useCloseWhenClickOutSide from "../hooks/useCloseWhenClickOutSide";
import { Children } from "react";

const SearchResultDropdownContext = createContext();

function SearchResultDropdown({ children }) {
  // Ta không thể set cứng vị trí được nên ta cần sử dụng state tính toán vị trí menu xuất hiện
  const [position, setPosition] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const ref = useCloseWhenClickOutSide(close, true);

  return (
    <SearchResultDropdownContext.Provider
      value={{
        open,
        close,
        isOpen,
        setPosition,
        position,
      }}
    >
      <div ref={ref} className="w-full">
        {children}
      </div>
    </SearchResultDropdownContext.Provider>
  );
}

function Open({ children }) {
  const { open, setPosition, isOpen, close } = useContext(
    SearchResultDropdownContext,
  );

  const handleOpen = (e) => {
    e.stopPropagation();
    const rect = e.target.closest("input").getBoundingClientRect("input");

    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 1,
    });

    open();
  };

  return (
    <div className="relative w-full">
      {cloneElement(children, {
        onFocus: handleOpen,
      })}
    </div>
  );
}

function DropdownContent({ children }) {
  const { isOpen } = useContext(SearchResultDropdownContext);

  return isOpen ? (
    <ul
      className={`absolute top-[81px] h-[30vh] w-full overflow-auto rounded-lg bg-white shadow-lg dark:bg-slate-700`}
    >
      {children}
    </ul>
  ) : null;
}

function Item({ children }) {
  const { close } = useContext(SearchResultDropdownContext);

  return cloneElement(children, {
    onClick: close,
  });
}

SearchResultDropdown.Open = Open;
SearchResultDropdown.DropdownContent = DropdownContent;
SearchResultDropdown.Item = Item;

export default SearchResultDropdown;
