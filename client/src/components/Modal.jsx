import React, { createContext, useContext, useEffect, useState } from "react";
import useCloseWhenClickOutSide from "../hooks/useCloseWhenClickOutSide";

const ModalContext = createContext();

function Modal({ children }) {
  const [showModalWithId, setShowModalWithId] = useState("");

  const openModal = (id) => {
    setShowModalWithId(id);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModalWithId("");
    document.body.style.overflow = "auto";
  };

  return (
    <ModalContext.Provider value={{ showModalWithId, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, id }) {
  const { openModal } = useContext(ModalContext);

  return React.cloneElement(children, {
    onClick: () => openModal(id),
  });
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
  }, [showModalWithId, id]);

  if (showModalWithId !== id) return null;

  return (
    <div
      className={`fixed inset-0 z-10 flex h-full w-full items-center justify-center overflow-hidden bg-black/30 backdrop-blur-sm`}
    >
      <div
        ref={ref}
        className={`fixed overflow-hidden rounded-lg bg-white p-6 shadow-md dark:bg-slate-800`}
      >
        {React.cloneElement(children, {
          onCloseModal: closeModal,
        })}
      </div>
    </div>
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
