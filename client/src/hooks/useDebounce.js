import { useEffect, useState } from "react";

function useDebounce(val, delay = 500) {
  const [debounceVal, setDebounceVal] = useState(val);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceVal(val);
    }, delay);

    return () => clearTimeout(id);
  }, [val, delay]);

  return debounceVal;
}

export default useDebounce;
