import { createTRPCProxyClient } from "@trpc/client";
import { ipcLink } from "electron-trpc/renderer";
import type { AppRouter } from "@notesfriend/desktop";
import { AppEventManager, AppEvents } from "../app-events";
import { TaskScheduler } from "../../utils/task-scheduler";
import { checkForUpdate } from "../../utils/updater";
import { showToast } from "../../utils/toast";

export const desktop = createTRPCProxyClient<AppRouter>({
  links: [ipcLink()]
});

attachListeners();
function attachListeners() {
  console.log("attaching listeners");

  desktop.updater.onChecking.subscribe(
    undefined,
    attachListener(AppEvents.checkingForUpdate)
  );

  desktop.updater.onAvailable.subscribe(
    undefined,
    attachListener(AppEvents.updateAvailable)
  );

  desktop.updater.onDownloaded.subscribe(
    undefined,
    attachListener(AppEvents.updateDownloadCompleted)
  );

  desktop.updater.onDownloadProgress.subscribe(
    undefined,
    attachListener(AppEvents.updateDownloadProgress)
  );

  desktop.updater.onNotAvailable.subscribe(
    undefined,
    attachListener(AppEvents.updateNotAvailable)
  );

  desktop.updater.onError.subscribe(
    undefined,
    attachListener(AppEvents.updateError)
  );

  TaskScheduler.register("updateCheck", "0 0 */12 * * * *", () => {
    checkForUpdate();
  });
}

function attachListener(event: string) {
  return {
    onData(...args: any[]) {
      console.log("Received data:", args);
      AppEventManager.publish(event, ...args);
    }
  };
}

export async function createWritableStream(path: string) {
  try {
    const resolvedPath = await desktop.integration.resolvePath.query({
      filePath: path
    });
    if (!resolvedPath) throw new Error("invalid path.");
    const { mkdirSync, createWriteStream }: typeof import("fs") = require("fs");
    const { dirname }: typeof import("path") = require("path");
    const { Writable } = require("stream");

    mkdirSync(dirname(resolvedPath), { recursive: true });
    return new WritableStream(
      Writable.toWeb(
        createWriteStream(resolvedPath, { encoding: "utf-8" })
      ).getWriter()
    );
  } catch (ex) {
    console.error(ex);
    if (ex instanceof Error) showToast("error", ex.message);
  }
}
