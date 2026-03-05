import { loadLanguage as _loadLanguage } from "./languages/index.js";

const loadedLanguages: Record<string, boolean> = {};
export function isLanguageLoaded(name: string) {
  return !!loadedLanguages[name];
}
export async function loadLanguage(shortName: string) {
  const { default: language } = (await _loadLanguage(shortName)) || {};
  loadedLanguages[shortName] = true;
  return language;
}
