/* eslint-disable no-var */

import { ELECTRON_TRPC_CHANNEL } from "electron-trpc/main";
// import type { NNCrypto } from "@notesfriend/crypto";
import { ipcRenderer } from "electron";
import { platform } from "os";

declare global {
  var os: () => "mas" | ReturnType<typeof platform>;
  var electronTRPC: any;
  // var NativeNNCrypto: (new () => NNCrypto) | undefined;
}

process.once("loaded", async () => {
  const electronTRPC = {
    sendMessage: (operation: any) =>
      ipcRenderer.send(ELECTRON_TRPC_CHANNEL, operation),
    onMessage: (callback: any) =>
      ipcRenderer.on(ELECTRON_TRPC_CHANNEL, (_event, args) => callback(args))
  };
  globalThis.electronTRPC = electronTRPC;
});

// globalThis.NativeNNCrypto = require("@notesfriend/crypto").NNCrypto;
globalThis.os = () => (MAC_APP_STORE ? "mas" : platform());
