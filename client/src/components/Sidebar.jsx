import { createContext, useContext, useEffect, useState } from "react";
import { HiMiniChevronDown, HiXMark } from "react-icons/hi2";
import useCloseWhenClickOutSide from "../hooks/useCloseWhenClickOutSide";
const SidebarContext = createContext();

function Sidebar({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const openSidebar = () => {
    setShowSidebar(true);
    document.body.style.overflow = "hidden";
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    document.body.style.overflow = "auto";
  };

  const toggleShowDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        showSidebar,
        openSidebar,
        closeSidebar,
        showDropdown,
        toggleShowDropdown,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function Toggle({ children }) {
  const { openSidebar } = useContext(SidebarContext);

  const handleClick = () => {
    openSidebar();
  };

  return (
    <button className="ml-auto" onClick={handleClick}>
      {children}
    </button>
  );
}

function Content({ children }) {
  const { showSidebar, closeSidebar } = useContext(SidebarContext);

  const ref = useCloseWhenClickOutSide(() => {
    closeSidebar();
  }, true);

  const handleClick = () => {
    document.body.style.overflow = "auto";
    closeSidebar();
  };

  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = "hidden";
    }

    return () => (document.body.style.overflow = "auto");
  }, [showSidebar]);

  if (!showSidebar) return null;

  return (
    <div
      className={`fixed inset-0 z-10 h-screen w-screen bg-black/30 backdrop-blur-sm`}
    >
      <div
        ref={ref}
        className={`fixed bottom-0 right-0 top-0 w-[60vw] overflow-auto bg-white shadow dark:bg-slate-800`}
      >
        <div className="flex h-screen flex-col divide-y dark:divide-slate-700">
          <div className="flex items-center px-4 py-5">
            <button className="text-2xl" onClick={handleClick}>
              {<HiXMark />}
            </button>
          </div>

          <div className="flex h-screen flex-col divide-y text-xs dark:divide-slate-700 md:text-base">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({ children, hasDropdown, toCloseSidebar = true }) {
  const { toggleShowDropdown, closeSidebar } = useContext(SidebarContext);

  function handleClick() {
    if (hasDropdown) {
      toggleShowDropdown();
    } else if (!toCloseSidebar) {
      return;
    } else {
      closeSidebar();
    }
  }

  const hasDropdownClass = `flex flex-col`;

  return (
    <div
      onClick={handleClick}
      className={`w-full ${hasDropdown && hasDropdownClass}`}
    >
      {children}
    </div>
  );
}

function DropdownToggle({ children }) {
  const { showDropdown } = useContext(SidebarContext);

  return (
    <button className="flex items-center">
      {children}
      <HiMiniChevronDown
        className={`h-5 w-5 transition-[transform] duration-[350ms] ${
          showDropdown ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );
}

function DropdownContent({ children }) {
  const { showDropdown } = useContext(SidebarContext);

  if (!showDropdown) return null;

  return (
    <div key="dropdownContent" className={`bg-gray-100 dark:bg-slate-700`}>
      {children}
    </div>
  );
}

function DropdownItem({ children }) {
  const { closeSidebar } = useContext(SidebarContext);

  const handleClick = () => {
    closeSidebar();
  };

  return (
    <div className={`w-full text-sm md:text-base`} onClick={handleClick}>
      {children}
    </div>
  );
}

Sidebar.Toggle = Toggle;
Sidebar.Content = Content;
Sidebar.Item = Item;
Sidebar.DropdownToggle = DropdownToggle;
Sidebar.DropdownContent = DropdownContent;
Sidebar.DropdownItem = DropdownItem;

export default Sidebar;
