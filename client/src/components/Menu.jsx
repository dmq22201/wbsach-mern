import React, { createContext, useContext, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import useCloseWhenClickOutSide from "../hooks/useCloseWhenClickOutSide";

const MenuContext = createContext();

function Menu({ children }) {
  const [showMenuWithId, setShowMenuWithId] = useState("");

  const openMenu = (id) => {
    setShowMenuWithId(id);
  };

  const closeMenu = () => {
    setShowMenuWithId("");
  };

  return (
    <MenuContext.Provider
      value={{
        showMenuWithId,
        openMenu,
        closeMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

function Toggle({ id, children }) {
  const { showMenuWithId, openMenu, closeMenu } = useContext(MenuContext);

  const handleClick = (e) => {
    e.stopPropagation();
    if (showMenuWithId === "" || showMenuWithId !== id) {
      openMenu(id);
    } else {
      closeMenu();
    }
  };

  return (
    <button onClick={handleClick} className="relative flex items-center gap-2">
      {children}
      <span
        className={`${
          showMenuWithId === id
            ? "rotate-180 transition-all"
            : "rotate-0 transition-all"
        }`}
      >
        <HiChevronDown />
      </span>
    </button>
  );
}

function List({ id, children, size }) {
  const { showMenuWithId, closeMenu } = useContext(MenuContext);

  const ref = useCloseWhenClickOutSide(() => {
    closeMenu();
  }, false);

  if (showMenuWithId !== id) return null;

  return (
    <ul
      ref={ref}
      className={`absolute right-0 top-full mt-5 ${size} divide-y rounded-lg bg-white shadow-md dark:divide-slate-700 dark:bg-slate-800 `}
    >
      {children}
    </ul>
  );
}

function Item({ children, toCloseMenu = true }) {
  const { closeMenu } = useContext(MenuContext);

  const handleClick = () => {
    if (!toCloseMenu) return;
    closeMenu();
  };

  return <li onClick={handleClick}>{children}</li>;
}

Menu.Toggle = Toggle;
Menu.List = List;
Menu.Item = Item;

export default Menu;
