import { useEffect } from "react";

import { checkForUpdate } from "../utils/updater";
import { AppEventManager, AppEvents } from "../common/app-events";
import BaseStore from "../stores";
import createStore from "../common/store";

type CompletedUpdateStatus = { type: "completed"; version: string };
type DownloadingUpdateStatus = { type: "downloading"; progress: number };
type AvailableUpdateStatus = { type: "available"; version: string };
type GenericUpdateStatus = { type: "checking" | "updated" };
export type UpdateStatus =
  | AvailableUpdateStatus
  | CompletedUpdateStatus
  | DownloadingUpdateStatus
  | GenericUpdateStatus;

class AutoUpdateStore extends BaseStore<AutoUpdateStore> {
  status?: UpdateStatus;
  setStatus = (status?: UpdateStatus) => {
    this.set({ status });
  };
}

const [useAutoUpdateStore] = createStore<AutoUpdateStore>(
  (set, get) => new AutoUpdateStore(set, get)
);

let checkingForUpdateTimeout = 0;
export function useAutoUpdater() {
  const { status, setStatus } = useAutoUpdateStore();

  useEffect(() => {
    function changeStatus(status?: UpdateStatus) {
      clearTimeout(checkingForUpdateTimeout);
      setStatus(status);
    }

    function checkingForUpdate() {
      changeStatus({ type: "checking" });
      checkingForUpdateTimeout = setTimeout(() => {
        changeStatus({ type: "updated" });
      }, 10000) as unknown as number;
    }

    function updateAvailable(info: { version: string }) {
      changeStatus({
        type: "available",
        version: info.version
      });
    }

    function updateNotAvailable() {
      if (IS_DESKTOP_APP) changeStatus({ type: "updated" });
      else changeStatus();
    }

    function updateDownloadCompleted(info: { version: string }) {
      changeStatus({ type: "completed", version: info.version });
    }

    function updateDownloadProgress(progressInfo: { percent: number }) {
      changeStatus({ type: "downloading", progress: progressInfo.percent });
    }

    const checkingForUpdateEvent = AppEventManager.subscribe(
      AppEvents.checkingForUpdate,
      checkingForUpdate
    );
    const updateAvailableEvent = AppEventManager.subscribe(
      AppEvents.updateAvailable,
      updateAvailable
    );
    const updateNotAvailableEvent = AppEventManager.subscribe(
      AppEvents.updateNotAvailable,
      updateNotAvailable
    );
    const updateCompletedEvent = AppEventManager.subscribe(
      AppEvents.updateDownloadCompleted,
      updateDownloadCompleted
    );
    const updateProgressEvent = AppEventManager.subscribe(
      AppEvents.updateDownloadProgress,
      updateDownloadProgress
    );

    checkingForUpdate();
    checkForUpdate().catch(console.error);

    return () => {
      checkingForUpdateEvent.unsubscribe();
      updateAvailableEvent.unsubscribe();
      updateNotAvailableEvent.unsubscribe();
      updateCompletedEvent.unsubscribe();
      updateProgressEvent.unsubscribe();
    };
  }, []);

  return status;
}

export { useAutoUpdateStore };
