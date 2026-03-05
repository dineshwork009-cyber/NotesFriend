/* eslint-disable no-var */
/// <reference lib="webworker" />

import {
  precacheAndRoute,
  createHandlerBoundToURL,
  cleanupOutdatedCaches
} from "workbox-precaching";
import { setCacheNameDetails } from "workbox-core";
import { registerRoute } from "workbox-routing";
import "./service-worker.dev.js";

declare var self: ServiceWorkerGlobalScope & typeof globalThis;

setCacheNameDetails({
  prefix: IS_BETA ? "notesfriend-beta" : "notesfriend",
  suffix: `${self.registration.scope}-${APP_VERSION}-${GIT_HASH}`,
  precache: "precache",
  runtime: "runtime"
});

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith("/_")) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(PUBLIC_URL + "/index.html")
);
