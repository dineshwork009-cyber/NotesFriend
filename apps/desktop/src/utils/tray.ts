import { app, Menu, Tray } from "electron";
import { AssetManager } from "./asset-manager";
import { isFlatpak } from "./index";
import { bringToFront } from "./bring-to-front";
import { bridge } from "../api/bridge";

let tray: Tray | undefined = undefined;
export function destroyTray() {
  if (tray) tray.destroy();
}

export function setupTray() {
  if (tray) tray.destroy();

  const trayIconSize =
    process.platform === "win32" || process.platform === "darwin" ? 16 : 32;

  tray = new Tray(
    AssetManager.icon("tray-icon", {
      size: process.platform === "darwin" ? 22 : 32
    })
  );

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show app",
      type: "normal",
      icon: isFlatpak()
        ? undefined
        : AssetManager.icon("tray-icon", { size: trayIconSize }),
      click: bringToFront
    },
    { type: "separator" },
    {
      label: "New note",
      type: "normal",
      icon: isFlatpak()
        ? undefined
        : AssetManager.icon("note-add", { size: trayIconSize }),
      click: () => {
        bringToFront();
        bridge.onCreateItem("note");
      }
    },
    {
      label: "New notebook",
      type: "normal",
      icon: isFlatpak()
        ? undefined
        : AssetManager.icon("notebook-add", { size: trayIconSize }),
      click: () => {
        bringToFront();
        bridge.onCreateItem("notebook");
      }
    },
    { type: "separator" },
    {
      label: "Quit",
      icon: isFlatpak()
        ? undefined
        : AssetManager.icon("quit", { size: trayIconSize }),
      type: "normal",
      click: () => {
        app.exit(0);
      }
    }
  ]);
  tray.on("double-click", bringToFront);
  if (process.platform !== "darwin") tray.on("click", bringToFront);
  tray.setToolTip("Notesfriend");
  tray.setContextMenu(contextMenu);
}
