/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "pseudo-LOCALE"],
  sourceLocale: "en",
  pseudoLocale: "pseudo-LOCALE",
  fallbackLocales: {
    "pseudo-LOCALE": "en"
  },
  catalogs: [
    {
      path: "<rootDir>/locale/{locale}",
      include: ["src", "generated"]
    }
  ],
  format: "po",
  catalogsMergePath: "<rootDir>/locales/${locale}",
  compileNamespace: "json"
};
