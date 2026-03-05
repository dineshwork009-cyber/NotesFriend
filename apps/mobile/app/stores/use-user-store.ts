import { isFeatureAvailable } from "@notesfriend/common";
import { Profile, User } from "@notesfriend/core";
import { create } from "zustand";
import SettingsService from "../services/settings";
import { presentDialog } from "../components/dialog/functions";
import { strings } from "@notesfriend/intl";
import { eSendEvent } from "../services/event-manager";
import { eCloseSimpleDialog } from "../utils/events";
import Navigation from "../services/navigation";

export enum SyncStatus {
  Passed,
  Failed,
  Never
}

export interface UserStore {
  user: User | null | undefined;
  premium: boolean;
  lastSynced: string | number;
  syncing: boolean;
  lastSyncStatus: SyncStatus;
  setUser: (user: User | null | undefined) => void;
  setPremium: (premium: boolean) => void;
  setSyncing: (syncing: boolean, status?: SyncStatus) => void;
  setLastSynced: (lastSynced: number | "Never") => void;
  appLocked: boolean;
  lockApp: (verified: boolean) => void;
  disableAppLockRequests: boolean;
  setDisableAppLockRequests: (shouldBlockVerifyUser: boolean) => void;
  profile?: Partial<Profile>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  premium: false,
  lastSynced: "Never",
  syncing: false,
  appLocked: false,
  setUser: (user) => set({ user: user }),
  setPremium: (premium) => set({ premium: premium }),
  setSyncing: (syncing, status = SyncStatus.Passed) => {
    set({ syncing: syncing, lastSyncStatus: status });
  },
  setLastSynced: (lastSynced) => set({ lastSynced: lastSynced }),
  lockApp: (appLocked) => {
    set({ appLocked });
    if (!appLocked) {
      isFeatureAvailable("appLock").then((feature) => {
        if (!feature.isAllowed) {
          SettingsService.setProperty("appLockEnabled", false);
          setTimeout(() => {
            presentDialog({
              title: "App Lock Disabled",
              paragraph: feature?.error,
              positiveText: strings.upgrade(),
              negativeText: strings.cancel(),
              positivePress: async () => {
                eSendEvent(eCloseSimpleDialog);
                if (SettingsService.getProperty("serverUrls")) return;
                Navigation.navigate("PayWall", {
                  context: "logged-in"
                });
              }
            });
          }, 1000);
        }
      });
    }
  },
  lastSyncStatus: SyncStatus.Never,
  disableAppLockRequests: false,
  setDisableAppLockRequests: (disableAppLockRequests) => {
    set({ disableAppLockRequests });
    setTimeout(() => {
      set({ disableAppLockRequests: false });
    }, 1000);
  },
  profile: undefined
}));
