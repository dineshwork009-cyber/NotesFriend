import { useEffect, useState } from "react";
import { desktop } from "../common/desktop-bridge";
import { getPlatform } from "../utils/platform";

export function useWindowControls() {
  const [isMaximized, setIsMaximized] = useState<boolean>();
  const [isFullscreen, setIsFullscreen] = useState<boolean>();

  useEffect(() => {
    const event = desktop?.window.onWindowStateChanged.subscribe(undefined, {
      onData(value) {
        setIsMaximized(value.maximized);
        setIsFullscreen(value.fullscreen);
      }
    });
    desktop?.window.maximized.query().then((value) => setIsMaximized(value));
    desktop?.window.fullscreen.query().then((value) => setIsFullscreen(value));

    function onFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      event?.unsubscribe();
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  return {
    isMaximized,
    isFullscreen,
    hasNativeWindowControls:
      !IS_DESKTOP_APP ||
      hasNativeTitlebar ||
      getPlatform() === "darwin" ||
      getPlatform() === "win32"
  };
}
