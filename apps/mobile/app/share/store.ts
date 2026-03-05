import {
  ThemeDark,
  ThemeDefinition,
  ThemeLight,
  useThemeEngineStore
} from "@notesfriend/theme";
import { Appearance } from "react-native";
import { create } from "zustand";
import { db, setupDatabase } from "../common/database";
import { MMKV } from "../common/database/mmkv";
import { SettingStore } from "../stores/use-setting-store";

export async function initDatabase() {
  if (!db.isInitialized) {
    await setupDatabase();
    await db.init();
  }
}

const StorageKeys = {
  appendNote: "shareMenuAppendNote",
  selectedNotebooks: "shareMenuSelectedNotebooks",
  selectedTag: "shareMenuSelectedTag",
  appSettings: "appSettings"
};

let appSettingsJson = MMKV.getString(StorageKeys.appSettings);
let appSettings: SettingStore["settings"] | null = null;
if (appSettingsJson) {
  appSettings = JSON.parse(appSettingsJson) as SettingStore["settings"];
}

const systemColorScheme = Appearance.getColorScheme();
const appColorScheme = appSettings?.colorScheme;
const useSystemTheme = appSettings?.useSystemTheme;
const currentColorScheme = useSystemTheme ? systemColorScheme : appColorScheme;

const theme =
  currentColorScheme === "dark"
    ? appSettings?.darkTheme
    : appSettings?.lighTheme;

const currentTheme =
  theme || (currentColorScheme === "dark" ? ThemeDark : ThemeLight);

useThemeEngineStore.getState().setTheme(currentTheme);

export type ShareStore = {
  theme: ThemeDefinition;
  appendNote: string | null;
  selectedTags: string[];
  selectedNotebooks: string[];
  setAppendNote: (noteId: string | null) => void;
  restore: () => void;
  setSelectedNotebooks: (selectedNotebooks: string[]) => void;
  setSelectedTags: (selectedTags: string[]) => void;
};
export const useShareStore = create<ShareStore>((set) => ({
  theme: currentTheme,
  appendNote: null,
  setAppendNote: (noteId) => {
    if (!noteId) {
      MMKV.removeItem(StorageKeys.appendNote);
    } else {
      MMKV.setItem(StorageKeys.appendNote, noteId);
    }
    set({ appendNote: noteId });
  },
  restore: () => {
    let appendNote = MMKV.getString(StorageKeys.appendNote);
    let selectedNotebooks = MMKV.getString(StorageKeys.selectedNotebooks);
    let selectedTags = MMKV.getString(StorageKeys.selectedTag);
    set({
      appendNote: appendNote,
      selectedNotebooks: selectedNotebooks ? JSON.parse(selectedNotebooks) : [],
      selectedTags: selectedTags ? JSON.parse(selectedTags) : []
    });
  },
  selectedTags: [],
  selectedNotebooks: [],
  setSelectedNotebooks: (selectedNotebooks: string[]) => {
    MMKV.setItem(
      StorageKeys.selectedNotebooks,
      JSON.stringify(selectedNotebooks)
    );
    set({ selectedNotebooks });
  },
  setSelectedTags: (selectedTags) => {
    MMKV.setItem(StorageKeys.selectedTag, JSON.stringify(selectedTags));
    set({ selectedTags });
  }
}));

export const Config = {
  corsProxy: appSettings?.corsProxy
};
