import { I18n, i18n as i18nn } from "@lingui/core";

let i18nGlobal: I18n | undefined = undefined;

export const setI18nGlobal = (i18n: I18n) => {
  i18nGlobal = i18n;
};

export function getI18nGlobal() {
  return i18nGlobal;
}
export const i18n = new Proxy(
  {},
  {
    get: (target, property) => {
      return (
        i18nGlobal?.[property as keyof I18n] || i18nn[property as keyof I18n]
      );
    }
  }
);
