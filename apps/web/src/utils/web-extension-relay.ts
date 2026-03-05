import { expose, Remote, wrap } from "comlink";
import { updateStatus } from "../hooks/use-status";
import {
  Gateway,
  WEB_EXTENSION_CHANNEL_EVENTS
} from "@notesfriend/web-clipper/common/bridge.js";
import { Extension } from "../components/icons";

export class WebExtensionRelay {
  private gateway?: Remote<Gateway>;
  constructor() {
    window.addEventListener("message", async (ev) => {
      const { type } = ev.data;
      switch (type) {
        case WEB_EXTENSION_CHANNEL_EVENTS.ON_READY:
          this.gateway = undefined;
          await this.connect();
          break;
      }
    });
  }

  async connect(): Promise<boolean> {
    if (this.gateway) return true;
    const { WebExtensionServer } = await import("./web-extension-server");

    const channel = new MessageChannel();
    channel.port1.start();
    channel.port2.start();

    window.postMessage({ type: WEB_EXTENSION_CHANNEL_EVENTS.ON_CREATED }, "*", [
      channel.port2
    ]);

    const { port1 } = channel;

    expose(new WebExtensionServer(), port1);
    this.gateway = wrap(port1);

    const metadata = await this.gateway.connect();

    updateStatus({
      key: metadata.id,
      status: `${metadata.name} connected`,
      icon: Extension
    });

    return true;
  }
}
