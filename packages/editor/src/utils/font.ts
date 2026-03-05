import { getFontConfig } from "@notesfriend/theme";

const FONTS = [
  {
    title: "Monospace",
    id: "monospace",
    font: getFontConfig().fonts.monospace
  },
  {
    title: "Sans-serif",
    id: "sans-serif",
    font: getFontConfig().fonts.body
  },
  {
    title: "Serif",
    id: "serif",
    font: `Noto Serif, Times New Roman, serif`
  }
];

export function getFonts() {
  return FONTS;
}

export function getFontById(id: string) {
  return FONTS.find((a) => a.id === id);
}

export function getFontIds() {
  return FONTS.map((a) => a.id);
}
