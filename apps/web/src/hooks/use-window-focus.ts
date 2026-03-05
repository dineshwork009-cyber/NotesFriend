import { useEffect, useState } from "react";

export function useWindowFocus() {
  const [isFocused, setIsFocused] = useState<boolean>(true);

  useEffect(() => {
    function onFocus() {
      setIsFocused(true);
    }
    function onBlur() {
      setIsFocused(false);
    }
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("focus", onFocus);
      document.removeEventListener("blur", onBlur);
    };
  }, []);

  return {
    isFocused
  };
}
