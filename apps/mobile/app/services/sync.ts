import NetInfo from "@react-native-community/netinfo";
import { db } from "../common/database";
import { DatabaseLogger } from "../common/database/index";
import { initAfterSync } from "../stores/index";
import { SyncStatus, useUserStore } from "../stores/use-user-store";
import BackgroundSync from "./background-sync";
import { ToastManager } from "./event-manager";
import SettingsService from "./settings";

export const ignoredMessages = [
  "Sync already running",
  "Not allowed to start service intent",
  "WebSocket failed to connect",
  "Failed to start the HttpConnection before",
  "Could not connect to the Sync server",
  "Network request failed"
];
let pendingSync: any = undefined;
let syncTimer: NodeJS.Timeout;
let lastSyncType = "full";

const run = async (
  context = "global",
  forced = false,
  type: "full" | "send" | "fetch" = "full",
  onCompleted?: (status?: number) => void,
  lastSyncTime?: number
) => {
  if (useUserStore.getState().syncing) {
    DatabaseLogger.info("Sync in progress");
    pendingSync = {
      forced,
      type: type,
      context: context,
      onCompleted,
      lastSyncTime
    };
    return;
  }

  if (pendingSync) {
    pendingSync = undefined;
    DatabaseLogger.info("Running pending sync...");
  }

  clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    const userstore = useUserStore.getState();
    userstore.setSyncing(true);
    const user = await db.user.getUser();

    if (!user || SettingsService.get().disableSync) {
      userstore.setSyncing(false);
      initAfterSync(type != "send" ? "full" : "send");
      pendingSync = undefined;
      return onCompleted?.(SyncStatus.Failed);
    }

    lastSyncType = type != "send" ? "full" : "send";

    let error: Error | undefined = undefined;

    try {
      await db.sync({
        type: type,
        force: forced,
        offlineMode: SettingsService.get().offlineMode
      });

      if (error) throw error;
    } catch (e) {
      error = e as Error;
      DatabaseLogger.error(error, "[Client] Failed to sync");
      if (
        !ignoredMessages.find((message) => error?.message?.includes(message)) &&
        userstore.user
      ) {
        const status = await NetInfo.fetch();
        if (status.isConnected && status.isInternetReachable) {
          ToastManager.error(e as Error, "Sync failed", context);
        }
      }
    } finally {
      userstore.setSyncing(
        false,
        error ? SyncStatus.Failed : SyncStatus.Passed
      );
      onCompleted?.(error ? SyncStatus.Failed : SyncStatus.Passed);
      if (pendingSync)
        Sync.run(
          pendingSync.context,
          pendingSync.forced,
          pendingSync.type,
          pendingSync.onCompleted,
          pendingSync.lastSyncTime
        );
    }
  }, 300);
};

const Sync = {
  run,
  getLastSyncType: () => lastSyncType
};

export default Sync;
