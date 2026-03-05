import { nativeTheme } from "electron";
import { config } from "./config";
import { z } from "zod";

export const Theme = z.union([
  z.literal("system"),
  z.literal("light"),
  z.literal("dark")
]);

export type Theme = z.infer<typeof Theme>;

function getTheme() {
  return config.theme;
}

function setTheme(theme: Theme) {
  changeTheme(theme);
  if (globalThis.window)
    globalThis.window.setBackgroundColor(getBackgroundColor());
  config.theme = theme;
}

function getBackgroundColor() {
  return (
    config.backgroundColor ||
    (nativeTheme.shouldUseDarkColors ? "#0f0f0f" : "#ffffff")
  );
}

function getSystemTheme() {
  const listeners = nativeTheme.rawListeners("updated");
  nativeTheme.removeAllListeners("updated");

  const oldThemeSource = nativeTheme.themeSource;
  nativeTheme.themeSource = "system";
  const currentTheme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
  nativeTheme.themeSource = oldThemeSource;

  setTimeout(
    () =>
      listeners.forEach((a) => nativeTheme.addListener("updated", () => a())),
    1000
  );
  return currentTheme;
}

export { getTheme, setTheme, getBackgroundColor, getSystemTheme };

function changeTheme(theme: Theme) {
  const listeners = nativeTheme.rawListeners("updated");
  nativeTheme.removeAllListeners("updated");

  nativeTheme.themeSource = theme;

  setTimeout(
    () =>
      listeners.forEach((a) => nativeTheme.addListener("updated", () => a())),
    1000
  );
}
