import { browser } from "webextension-polyfill-ts";
import { expose, Remote, wrap } from "comlink";
import { createEndpoint } from "../utils/comlink-extension";
import {
  Clip,
  Gateway,
  Server,
  WEB_EXTENSION_CHANNEL_EVENTS
} from "../common/bridge";

declare global {
  // eslint-disable-next-line no-var
  var clipperBridgeConnected: boolean;
}

function attachOnConnectListener() {
  if (globalThis.clipperBridgeConnected) return;
  globalThis.clipperBridgeConnected = true;

  browser.runtime.onConnect.addListener((port) => {
    window.addEventListener("message", (ev) => {
      const { type } = ev.data;
      switch (type) {
        case WEB_EXTENSION_CHANNEL_EVENTS.ON_CREATED:
          if (ev.ports.length) {
            const mainPort = ev.ports.at(0);
            if (mainPort) {
              expose(new BackgroundGateway(), mainPort);
              const server: Remote<Server> = wrap<Server>(mainPort);
              expose(
                {
                  login: () => server.login(),
                  getNotes: () => server.getNotes(),
                  getNotebooks: () => server.getNotebooks(),
                  getTags: () => server.getTags(),
                  saveClip: (clip: Clip) => server.saveClip(clip)
                },
                createEndpoint(port)
              );
              port.postMessage({ success: true });
            } else {
              port.postMessage({ success: false });
            }
          }
          break;
      }
    });

    window.postMessage({ type: WEB_EXTENSION_CHANNEL_EVENTS.ON_READY }, "*");
  });
}

class BackgroundGateway implements Gateway {
  connect() {
    return {
      name: "Web clipper",
      id: "unknown-id"
    };
  }
}

attachOnConnectListener();
