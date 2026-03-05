import NetworkCheckWorker from "./network-check.worker.ts?worker";
import type { NetworkCheck as NetworkWorker } from "./network-check.worker";
import { wrap, Remote } from "comlink";

export class NetworkCheck {
  private worker!: globalThis.Worker;
  private network!: Remote<NetworkWorker>;

  constructor() {
    this.worker = new NetworkCheckWorker();
    this.network = wrap<NetworkWorker>(this.worker);
  }

  waitForInternet() {
    return this.network.waitForInternet();
  }
}
