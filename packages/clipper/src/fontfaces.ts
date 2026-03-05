import { FetchOptions } from "./fetch.js";
import { inlineAll, shouldProcess } from "./inliner.js";

async function resolveAll(options?: FetchOptions) {
  const fonts = readAll();
  const cssStrings: string[] = [];
  for (const font of fonts) {
    cssStrings.push(await font.resolve(options));
  }
  return cssStrings.join("\n");
}

function readAll() {
  const cssRules = getWebFonts(document.styleSheets);
  const fonts = selectWebFontRules(cssRules);
  return fonts.map(newWebFont);
}

function getWebFonts(styleSheets: StyleSheetList) {
  const cssRules: CSSFontFaceRule[] = [];
  for (const sheet of styleSheets) {
    try {
      const allFonts = selectWebFontRules(Array.from(sheet.cssRules));
      if (allFonts.length > 3) cssRules.push(allFonts[0]);
    } catch (e) {
      if (e instanceof Error) {
        console.log(
          "Error while reading CSS rules from " + sheet.href,
          e.toString()
        );
      }
    }
  }
  return cssRules;
}

function newWebFont(webFontRule: CSSFontFaceRule) {
  return {
    resolve: function resolve(options?: FetchOptions) {
      const baseUrl = (webFontRule.parentStyleSheet || {}).href || undefined;
      return inlineAll(webFontRule.cssText, options, baseUrl);
    },
    src: function () {
      return webFontRule.style.getPropertyValue("src");
    }
  };
}

function selectWebFontRules(cssRules: CSSRule[]): CSSFontFaceRule[] {
  return cssRules
    .filter(function (rule) {
      return rule.type === CSSRule.FONT_FACE_RULE;
    })
    .filter(function (rule) {
      return shouldProcess(
        (rule as CSSFontFaceRule).style.getPropertyValue("src")
      );
    }) as CSSFontFaceRule[];
}

export { resolveAll };
