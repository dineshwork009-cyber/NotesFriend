export type Platforms = "web" | "desktop";
export type AppVersion = typeof appVersion;
export const appVersion = {
  formatted: format(APP_VERSION, GIT_HASH, PLATFORM),
  clean: APP_VERSION,
  numerical: versionAsNumber(APP_VERSION),
  hash: GIT_HASH,
  isBeta: IS_BETA
};

function format(version?: string, hash?: string, type?: "web" | "desktop") {
  return `${version}-${hash}-${type}`;
}

function versionAsNumber(version: string) {
  return parseInt(version.replace(/\D/g, ""));
}

export function getServiceWorkerVersion(
  serviceWorker: ServiceWorker
): Promise<AppVersion> {
  return new Promise((resolve) => {
    function onMessage(ev: MessageEvent) {
      const { type } = ev.data;
      if (type !== "GET_VERSION") return;

      navigator.serviceWorker.removeEventListener("message", onMessage);
      const { version, hash, isBeta } = ev.data;
      resolve({
        formatted: format(version, hash, PLATFORM),
        numerical: versionAsNumber(version),
        clean: version,
        hash,
        isBeta
      });
    }

    navigator.serviceWorker.addEventListener("message", onMessage);
    serviceWorker.postMessage({ type: "GET_VERSION" });
  });
}

export { getChangelog } from "./changelog";
