import { useEffect, useRef } from "react";

function useCloseWhenClickOutSide(handlerFn, onlyListenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handlerFn();
      }
    }

    document.body.addEventListener("click", handleClick, onlyListenCapturing);

    return () =>
      document.body.removeEventListener(
        "click",
        handleClick,
        onlyListenCapturing,
      );
  }, [handlerFn, onlyListenCapturing]);

  return ref;
}

export default useCloseWhenClickOutSide;
