import React, { createContext, useContext, useState } from "react";

import useCloseWhenClickOutSide from "../hooks/useCloseWhenClickOutSide";

const MenuContext = createContext();

function Menu({ children }) {
  const [showMenuWithId, setShowMenuWithId] = useState("");

  // Ta không thể set cứng vị trí được nên ta cần sử dụng state tính toán vị trí menu xuất hiện
  const [position, setPosition] = useState(null);

  const openMenu = (id) => {
    setShowMenuWithId(id);
  };

  const closeMenu = () => {
    setShowMenuWithId("");
  };

  const ref = useCloseWhenClickOutSide(() => {
    closeMenu();
  }, true);

  return (
    <MenuContext.Provider
      value={{
        showMenuWithId,
        openMenu,
        closeMenu,
        position,
        setPosition,
      }}
    >
      <div className="relative w-fit" ref={ref}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}

function Toggle({ id, children, className }) {
  const { showMenuWithId, openMenu, closeMenu, setPosition } =
    useContext(MenuContext);

  const handleClick = (e) => {
    e.stopPropagation();

    const rect = e.target.closest("button").getBoundingClientRect("button");

    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 1,
    });

    if (showMenuWithId === "" || showMenuWithId !== id) {
      openMenu(id);
    } else {
      closeMenu();
    }
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

function List({ id, children, size }) {
  const { showMenuWithId, position } = useContext(MenuContext);

  if (showMenuWithId !== id) return null;

  const pos = `top-[${position?.y}px] right-0`;

  return (
    <ul
      className={`absolute ${pos} mt-5 ${size} z z-10 divide-y rounded-lg bg-white  shadow-2xl dark:divide-slate-700 dark:bg-slate-700`}
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
