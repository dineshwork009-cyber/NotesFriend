import { AppEventManager, AppEvents } from "../common/app-events";
import { desktop } from "../common/desktop-bridge";
import { appVersion, getServiceWorkerVersion } from "./version";

export async function checkForUpdate() {
  if (IS_DESKTOP_APP) await desktop?.updater.check.query().catch(console.error);
  else {
    AppEventManager.publish(AppEvents.checkingForUpdate);

    const registrations =
      (await navigator.serviceWorker?.getRegistrations()) || [];
    for (const registration of registrations) {
      await registration.update();
      if (registration.waiting) {
        const workerVersion = await getServiceWorkerVersion(
          registration.waiting
        );
        if (
          !workerVersion ||
          workerVersion.numerical <= appVersion.numerical ||
          workerVersion.hash === appVersion.hash
        ) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          continue;
        }

        AppEventManager.publish(AppEvents.updateDownloadCompleted, {
          version: workerVersion.formatted
        });
        return;
      }
    }

    AppEventManager.publish(AppEvents.updateNotAvailable);
  }
}

export async function downloadUpdate() {
  if (IS_DESKTOP_APP) await desktop?.updater.download.query();
  else {
    console.log("Force updating");
    try {
      if (!("serviceWorker" in navigator)) return;
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
    } catch (e) {
      console.error(e);
    }
  }
}

export async function installUpdate() {
  if (IS_DESKTOP_APP) await desktop?.updater.install.query();
  else {
    const registrations =
      (await navigator.serviceWorker?.getRegistrations()) || [];
    for (const registration of registrations) {
      if (registration.waiting) {
        registration.waiting.addEventListener("statechange", () => {
          const worker =
            registration.active ||
            registration.waiting ||
            registration.installing;
          if (worker?.state === "activated") {
            window.location.reload();
          }
        });
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    }
  }
}
