import { cloneElement, createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { selectPaymentMethod } from "../features/cart/cartSlice";

const AccordionContext = createContext();

function Accordion({ children }) {
  const [idToOpen, setIdToOpen] = useState("");

  const currentPaymentMethod = useSelector(selectPaymentMethod);

  const open = (id) => setIdToOpen(id);
  const close = () => setIdToOpen("");

  return (
    <AccordionContext.Provider
      value={{ idToOpen, open, close, currentPaymentMethod }}
    >
      {children}
    </AccordionContext.Provider>
  );
}

function Item({ children }) {
  return <div className="flex flex-col">{children}</div>;
}

function Toggle({ children, id, onClick }) {
  const { open, close, idToOpen, currentPaymentMethod } =
    useContext(AccordionContext);

  const handleClick = (e) => {
    e.stopPropagation();
    if (idToOpen === "" || idToOpen !== id) {
      open(id);
      onClick?.();
    } else {
      close();
    }
  };

  return (
    <button
      className={`w-full  rounded-lg p-4 text-left font-semibold transition-all ${
        currentPaymentMethod === id
          ? "bg-violet-500 text-white"
          : "bg-slate-100 dark:bg-slate-700"
      }`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

function Content({ children, id }) {
  const { idToOpen } = useContext(AccordionContext);

  console.log(id !== idToOpen);

  if (id !== idToOpen) return null;

  return <div className="bg-slate-200 p-4 dark:bg-slate-700">{children}</div>;
}

Accordion.Item = Item;
Accordion.Toggle = Toggle;
Accordion.Content = Content;
export default Accordion;
