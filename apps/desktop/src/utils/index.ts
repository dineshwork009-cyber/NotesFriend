import { app } from "electron";
import { existsSync } from "fs";

export function isDevelopment() {
  return process.env.ELECTRON_IS_DEV
    ? Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1
    : !app.isPackaged;
}

export function isFlatpak() {
  return existsSync("/.flatpak-info");
}

export function isSnap() {
  return process.env.SNAP !== undefined;
}
