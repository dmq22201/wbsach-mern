import { createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  return (
    <AnimatePresence>
      {isOpenPopup && (
        <motion.div
          key="popup"
          className="fixed inset-0 z-10 flex h-full w-full items-center justify-center overflow-hidden bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "just" }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "just" }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed overflow-hidden bg-white p-6"
          >
            <div className="flex flex-col items-center justify-center gap-6">
              <div>{types[type]}</div>
              <p className="text-base font-semibold uppercase sm:text-2xl">
                {children}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

Popup.Window = Window;

export default Popup;
