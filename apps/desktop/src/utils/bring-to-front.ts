import { WindowState } from "./window-state";

export function bringToFront() {
  if (!globalThis.window) return;

  if (globalThis.window.isMinimized()) {
    if (new WindowState({}).isMaximized) {
      globalThis.window.maximize();
    } else globalThis.window.restore();
  }
  globalThis.window.show();
  globalThis.window.focus();
  globalThis.window.moveTop();
  globalThis.window.webContents.focus();
}
