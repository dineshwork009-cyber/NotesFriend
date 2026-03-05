import { useEffect, useRef, useState } from "react";

export function useTimer(duration: number) {
  const [enabled, setEnabled] = useState(false);
  const timeout = useRef<number>();

  const cancelTimeout = () => {
    setEnabled(false);
    clearTimeout(timeout.current);
  };

  const start = () => {
    cancelTimeout();
    setEnabled(true);

    timeout.current = setTimeout(() => {
      cancelTimeout();
    }, duration) as unknown as number;
  };

  useEffect(() => {
    return cancelTimeout;
  }, []);

  return { enabled, start };
}
