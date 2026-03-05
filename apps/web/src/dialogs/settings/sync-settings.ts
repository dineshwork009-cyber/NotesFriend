import { SettingsGroup } from "./types";
import { useStore as useAppStore } from "../../stores/app-store";
import { useStore as useSettingStore } from "../../stores/setting-store";
import { ConfirmDialog } from "../confirm";
import { strings } from "@notesfriend/intl";

export const SyncSettings: SettingsGroup[] = [
  {
    key: "sync",
    section: "sync",
    header: strings.sync(),
    settings: [
      {
        key: "toggle-sync",
        title: strings.disableSync(),
        description: strings.disableSyncDesc(),
        keywords: ["sync off", "toggle sync"],
        onStateChange: (listener) =>
          useAppStore.subscribe((s) => s.isSyncEnabled, listener),
        featureId: "syncControls",
        components: [
          {
            type: "toggle",
            isToggled: () => !useAppStore.getState().isSyncEnabled,
            toggle: () => useAppStore.getState().toggleSync()
          }
        ]
      },
      {
        key: "toggle-auto-sync",
        title: strings.disableAutoSync(),
        description: strings.disableAutoSyncDesc(),
        keywords: ["auto sync off", "automatic sync", "toggle auto sync"],
        onStateChange: (listener) =>
          useAppStore.subscribe((s) => s.isSyncEnabled, listener),
        featureId: "syncControls",
        components: [
          {
            type: "toggle",
            isToggled: () => !useAppStore.getState().isAutoSyncEnabled,
            toggle: () => useAppStore.getState().toggleAutoSync()
          }
        ]
      },
      {
        key: "toggle-realtime-sync",
        title: strings.disableRealtimeSync(),
        description: strings.disableRealtimeSyncDesc(),
        keywords: ["auto sync off", "automatic sync", "toggle auto sync"],
        onStateChange: (listener) =>
          useAppStore.subscribe((s) => s.isSyncEnabled, listener),
        featureId: "syncControls",
        components: [
          {
            type: "toggle",
            isToggled: () => !useAppStore.getState().isRealtimeSyncEnabled,
            toggle: () => useAppStore.getState().toggleRealtimeSync()
          }
        ]
      },
      {
        key: "full-offline-mode",
        title: strings.fullOfflineMode(),
        description: strings.fullOfflineModeDesc(),
        keywords: ["offline mode"],
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.isFullOfflineMode, listener),
        featureId: "fullOfflineMode",
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().isFullOfflineMode,
            toggle: () => useSettingStore.getState().toggleFullOfflineMode()
          }
        ]
      },
      {
        key: "force-sync",
        title: strings.havingProblemsWithSync(),
        description: strings.havingProblemsWithSyncDesc(),
        keywords: ["force sync", "sync issues", "sync error", "sync problem"],
        components: [
          {
            type: "button",
            title: strings.forcePushChanges(),
            variant: "error",
            action: () =>
              ConfirmDialog.show({
                title: strings.areYouSure(),
                message: strings.forceSyncNotice(),
                checks: {
                  accept: { text: strings.understand(), default: false }
                },
                positiveButtonText: strings.continue(),
                negativeButtonText: strings.cancel()
              }).then((result) => {
                if (!result || !result.checks?.accept) return;
                return useAppStore
                  .getState()
                  .sync({ force: true, type: "send" });
              })
          },
          {
            type: "button",
            title: strings.forcePullChanges(),
            variant: "error",
            action: () =>
              ConfirmDialog.show({
                title: strings.areYouSure(),
                message: strings.forcePullChangesDesc(),
                checks: {
                  accept: { text: strings.understand(), default: false }
                },
                positiveButtonText: strings.continue(),
                negativeButtonText: strings.cancel()
              }).then((result) => {
                if (!result || !result.checks?.accept) return;
                return useAppStore
                  .getState()
                  .sync({ force: true, type: "fetch" });
              })
          }
        ]
      }
    ]
  }
];
