/* eslint-disable no-var */

/// <reference lib="webworker" />

export default null;

declare var self: SharedWorkerGlobalScope & typeof globalThis;
const mapClientIdToPort: Map<string, MessagePort> = new Map();

self.addEventListener("connect", (event) => {
  console.log("connected", event);
  // The first message from a client associates the clientId with the port.
  const workerPort = event.ports[0];
  workerPort.addEventListener(
    "message",
    (event) => {
      console.log("received message", event.data);
      mapClientIdToPort.set(event.data.clientId, workerPort);

      // Remove the entry when the client goes away, which we detect when
      // the lock on its name becomes available.
      navigator.locks.request(event.data.clientId, { mode: "shared" }, () => {
        mapClientIdToPort.get(event.data.clientId)?.close();
        mapClientIdToPort.delete(event.data.clientId);
      });

      // Subsequent messages will be forwarded.
      workerPort.addEventListener("message", (event) => {
        const port = mapClientIdToPort.get(event.data.clientId);
        console.log("sending message to client", event.data.clientId, port);
        port?.postMessage(event.data, [...event.ports]);
      });
    },
    { once: true }
  );
  workerPort.start();
});
