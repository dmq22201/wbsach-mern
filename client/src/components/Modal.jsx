import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useCloseWhenClickOutSide from "../hooks/useCloseWhenClickOutSide";

const ModalContext = createContext();

function Modal({ children }) {
  const [showModalWithId, setShowModalWithId] = useState("");

  const openModal = (id) => {
    setShowModalWithId(id);
  };

  const closeModal = () => {
    setShowModalWithId("");
  };

  return (
    <ModalContext.Provider value={{ showModalWithId, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, id }) {
  const { openModal } = useContext(ModalContext);

  if (children.type.name === "Button") {
    return React.cloneElement(children, {
      onClick: () => openModal(id),
    });
  }

  return children;
}

function Window({ id, children, isCloseWhenClickOuside = true }) {
  const { showModalWithId, closeModal } = useContext(ModalContext);

  const ref = useCloseWhenClickOutSide(() => {
    if (!isCloseWhenClickOuside) return;
    closeModal();
  }, true);

  useEffect(() => {
    if (showModalWithId === id) {
      document.body.style.overflow = "hidden";
    }

    return () => (document.body.style.overflow = "auto");
  }, [showModalWithId]);

  return (
    <AnimatePresence>
      {showModalWithId === id && (
        <motion.div
          key={showModalWithId}
          className="fixed inset-0 z-10 flex h-full w-full items-center justify-center overflow-hidden bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "just" }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key={showModalWithId}
            ref={ref}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "just" }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed overflow-hidden bg-white p-6"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Action({ children }) {
  const { closeModal } = useContext(ModalContext);
  return (
    <div className="flex gap-6">
      {React.Children.map(children, (child) => {
        if (child.type.name === "Button" && child.props.toCloseModal === true) {
          return React.cloneElement(child, {
            onClick: () => closeModal(),
          });
        }
        return child;
      })}
    </div>
  );
}

Modal.Action = Action;
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
