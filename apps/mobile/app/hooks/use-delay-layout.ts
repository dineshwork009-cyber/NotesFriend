import { useEffect, useState } from "react";

export const useDelayLayout = (delay: number) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [delay]);

  return loading;
};
