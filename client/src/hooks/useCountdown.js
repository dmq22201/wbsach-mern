import { useState, useEffect } from "react";

function useCountdown() {
  const [secondsLeft, setSecondLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timeout = setTimeout(() => {
      setSecondLeft((secondsLeft) => secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  return { secondsLeft, setSecondLeft };
}

export default useCountdown;
