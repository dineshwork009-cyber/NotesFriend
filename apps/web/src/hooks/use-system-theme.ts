import { useEffect, useState } from "react";
import useMediaQuery from "./use-media-query";
import { desktop } from "../common/desktop-bridge";

export function useSystemTheme() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [systemTheme, setSystemTheme] = useState(isDarkMode ? "dark" : "light");

  useEffect(() => {
    setSystemTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const { unsubscribe } =
      desktop?.integration.onThemeChanged.subscribe(undefined, {
        onData: setSystemTheme
      }) || {};
    return () => {
      unsubscribe?.();
    };
  }, []);

  return systemTheme === "dark";
}
