import { tryParse } from "./parse";

function set<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function get<T>(key: string, def?: T): T {
  const value = window.localStorage.getItem(key);
  if (!value && def !== undefined) return def;
  return value ? tryParse(value) : def;
}

function remove(key: string) {
  window.localStorage.removeItem(key);
}

function clear() {
  window.localStorage.clear();
}

function all<T>(): Record<string, T> {
  const data: Record<string, T> = {};
  for (let i = 0; i < window.localStorage.length; ++i) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    data[key] = get(key);
  }
  return data;
}

function has(predicate: (key: string) => boolean) {
  for (let i = 0; i < window.localStorage.length; ++i) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    if (predicate(key)) return true;
  }
  return false;
}

function logout() {
  const toKeep = [
    "editorConfig",
    "backupStorageLocation",
    "serverUrls",
    "corsProxy",
    "theme:light",
    "theme:dark",
    "colorScheme",
    "followSystemTheme",
    "doubleSpacedLines"
  ];
  const vals = {} as Record<string, any>;

  for (const keep of toKeep) {
    const val = get(keep);
    if (val !== undefined) vals[keep] = val;
  }

  clear();

  for (const key in vals) {
    set(key, vals[key]);
  }
}

const Config = { set, get, clear, all, has, remove, logout };
export default Config;
