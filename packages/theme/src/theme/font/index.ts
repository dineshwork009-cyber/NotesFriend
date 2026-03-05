import { FontSizes, getFontSizes } from "./fontsize.js";

const SANS_FONT_STACK = [
  `"Inter"`,
  `"Noto Sans"`,
  "Frutiger",
  "Calibri",
  "Myriad",
  "Arial",
  "Ubuntu",
  "Helvetica",
  "-apple-system",
  "BlinkMacSystemFont",
  "sans-serif"
];
const MONOSPACE_FONT_STACK = [
  "Hack",
  "Consolas",
  '"Andale Mono"',
  '"Lucida Console"',
  '"Liberation Mono"',
  '"Courier New"',
  "Courier",
  "monospace"
];

export type FontConfig = {
  fontSizes: FontSizes;
  fontWeights: {
    normal: number;
    body: number;
    heading: number;
    bold: number;
    medium: number;
  };
  fonts: { body: string; monospace: string; heading: string };
};
export function getFontConfig(): FontConfig {
  return {
    fontSizes: getFontSizes(),
    fontWeights: {
      normal: 400,
      body: 400,
      heading: 600,
      bold: 600,
      medium: 500
    },
    fonts: {
      body: SANS_FONT_STACK.join(","),
      monospace: MONOSPACE_FONT_STACK.join(","),
      heading: SANS_FONT_STACK.join(",")
    }
  };
}
