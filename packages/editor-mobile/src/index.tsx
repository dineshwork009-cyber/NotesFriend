import "./utils/index";
import "./utils/commands";
global.Buffer = require("buffer").Buffer;
import { i18n } from "@lingui/core";
import "@notesfriend/editor/styles/fonts.mobile.css";
import "@notesfriend/editor/styles/katex-fonts.mobile.css";
import "@notesfriend/editor/styles/katex.min.css";
import "@notesfriend/editor/styles/styles.css";
import { setI18nGlobal } from "@notesfriend/intl";
import { createRoot } from "react-dom/client";
import "./index.css";

setTimeout(() => {
  if (globalThis.__DEV__) {
    const logFn = global.console.log;
    global.console.log = function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      // eslint-disable-next-line prefer-rest-params
      logFn.apply(console, arguments);
      // eslint-disable-next-line prefer-rest-params
      globalThis.logger("info", ...arguments);
    };
  }
}, 100);
let appLoaded = false;
function loadApp() {
  if (appLoaded) return;
  appLoaded = true;
  const locale = globalThis.LINGUI_LOCALE_DATA
    ? Promise.resolve(globalThis.LINGUI_LOCALE_DATA)
    : globalThis.__DEV__ || process.env.NODE_ENV === "development"
    ? import("@notesfriend/intl/locales/$pseudo-LOCALE.json").then(
        ({ default: locale }) => ({ en: locale.messages })
      )
    : import("@notesfriend/intl/locales/$en.json").then(
        ({ default: locale }) => ({
          en: locale.messages
        })
      );

  locale.then(async (locale: { [name: string]: any }) => {
    i18n.load(locale);
    i18n.activate(globalThis.LINGUI_LOCALE || "en");
    //@ts-ignore
    setI18nGlobal(i18n);

    const rootElement = document.getElementById("root");
    if (rootElement) {
      const root = createRoot(rootElement);
      const App = require("./App").default;
      root.render(<App />);
    }
  });
}
globalThis.loadApp = loadApp;

if (process.env.NODE_ENV === "development") {
  loadApp();
}
