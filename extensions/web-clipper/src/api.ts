import { browser, Runtime, Tabs } from "webextension-polyfill-ts";
import { Remote, wrap } from "comlink";
import { createEndpoint } from "./utils/comlink-extension";
import { Server } from "./common/bridge";
import { APP_URL, APP_URL_FILTER } from "./common/constants";

type WebExtensionChannelMessage = { success: boolean };

let api: Remote<Server> | undefined;
export async function connectApi(openNew = false, onDisconnect?: () => void) {
  if (api) return api;

  const tabs = await findNotesfriendTabs(openNew);
  for (const tab of tabs) {
    try {
      const api = await Promise.race([
        connectToTab(tab, onDisconnect),
        timeout(5000)
      ]);
      if (!api) continue;
      return api as Remote<Server>;
    } catch (e) {
      console.error(e);
    }
  }

  return false;
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms, false));
}

async function connectToTab(tab: Tabs.Tab, onDisconnect?: () => void) {
  if (!tab.id) return false;

  if (browser.scripting) {
    await browser.scripting.executeScript({
      files: ["nnContentScript.bundle.js"],
      target: { tabId: tab.id }
    });
  } else {
    await browser.tabs.executeScript(tab.id, {
      file: "nnContentScript.bundle.js"
    });
  }

  const port = browser.tabs.connect(tab.id);
  port.onDisconnect.addListener(() => {
    api = undefined;
    onDisconnect?.();
  });

  return new Promise<Remote<Server> | false>(function connect(resolve) {
    async function onMessage(
      message: WebExtensionChannelMessage,
      port: Runtime.Port
    ) {
      if (message.success) {
        port.onMessage.removeListener(onMessage);
        api = wrap<Server>(createEndpoint(port));
        resolve(api);
      } else {
        resolve(false);
      }
    }

    port.onMessage.addListener(onMessage);
  });
}

export async function findNotesfriendTabs(openNew = false) {
  const tabs = await browser.tabs.query({
    url: APP_URL_FILTER,
    discarded: false,
    status: "complete"
  });

  if (tabs.length) return tabs;

  if (openNew) {
    const tab = await browser.tabs.create({ url: APP_URL, active: false });
    await new Promise<void>((resolve) =>
      browser.tabs.onUpdated.addListener(function onUpdated(id, info) {
        if (id === tab.id && info.status === "complete") {
          browser.tabs.onUpdated.removeListener(onUpdated);
          resolve();
        }
      })
    );
    return [tab];
  }
  return [];
}
