import "./index.css";
import "@notesfriend/web/src/polyfills";
import "@notesfriend/web/src/app.css";
import { ThemeDark, ThemeLight, themeToCSS } from "@notesfriend/theme";
import Config from "@notesfriend/web/src/utils/config";
import { setI18nGlobal, Messages } from "@notesfriend/intl";
import { i18n } from "@lingui/core";
import { App } from "./app";

const colorScheme = JSON.parse(
  window.localStorage.getItem("colorScheme") || '"light"'
);
const root = document.querySelector("html");
if (root) root.setAttribute("data-theme", colorScheme);

const theme =
  colorScheme === "dark"
    ? Config.get("theme:dark", ThemeDark)
    : Config.get("theme:light", ThemeLight);
const stylesheet = document.getElementById("theme-colors");
if (theme) {
  const css = themeToCSS(theme);
  if (stylesheet) stylesheet.innerHTML = css;
} else stylesheet?.remove();

const locale = import.meta.env.DEV
  ? import("@notesfriend/intl/locales/$pseudo-LOCALE.json")
  : import("@notesfriend/intl/locales/$en.json");
locale.then(({ default: locale }) => {
  i18n.load({
    en: locale.messages as unknown as Messages
  });
  i18n.activate("en");

  performance.mark("import:root");
  import("@notesfriend/web/src/root.js").then(({ startApp }) => {
    performance.mark("start:app");
    startApp(<App />);
  });
});
setI18nGlobal(i18n);
