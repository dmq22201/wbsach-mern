import { createContext, useContext, useEffect } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi2";

const PopupContext = createContext();
function Popup({ isOpenPopup, setIsOpenPopup, children }) {
  return (
    <PopupContext.Provider value={{ isOpenPopup, setIsOpenPopup }}>
      {children}
    </PopupContext.Provider>
  );
}

function Window({ type, children }) {
  const { isOpenPopup } = useContext(PopupContext);

  const types = {
    success: <HiOutlineCheckCircle className="h-28 w-28 text-green-500" />,
  };

  useEffect(() => {
    if (isOpenPopup) {
      document.body.style.overflow = "hidden";
    }

    return () => (document.body.style.overflow = "auto");
  }, [isOpenPopup]);

  if (!isOpenPopup) return null;

  return (
    <div className="fixed inset-0 z-10 flex h-full w-full items-center justify-center overflow-hidden bg-black/30 backdrop-blur-sm">
      <div className="fixed overflow-hidden rounded-lg bg-white p-6 text-black dark:bg-slate-800 dark:text-white">
        <div className="flex flex-col items-center justify-center gap-6">
          <div>{types[type]}</div>
          <p className="text-base font-semibold uppercase sm:text-2xl">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

Popup.Window = Window;

export default Popup;
