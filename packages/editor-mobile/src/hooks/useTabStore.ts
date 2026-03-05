import { createContext, useContext } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

globalThis.editorControllers = {};
globalThis.editors = {};
globalThis.editorTags = {};
globalThis.editorTitles = {};
globalThis.statusBars = {};

export type TabItem = {
  id: string;
  session?: {
    noteId?: string;
    readonly?: boolean;
    locked?: boolean;
    noteLocked?: boolean;
    scrollTop?: number;
    selection?: { to: number; from: number };
  };
  pinned?: boolean;
  needsRefresh?: boolean;
};

export type TabStore = {
  tabs: TabItem[];
  currentTab?: string;
  scrollPosition: Record<number, number>;
  biometryAvailable?: boolean;
  biometryEnrolled?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
  sessionId?: string;
  getCurrentNoteId: () => string | undefined;
};

export const useTabStore = create(
  persist<TabStore>(
    (set, get) => ({
      tabs: [
        {
          id: "679da59a3924d4bd56d16d3f",
          session: {
            id: "679da5a5667a16db2353a062"
          }
        }
      ],
      currentTab: "679da59a3924d4bd56d16d3f",
      scrollPosition: {},
      getCurrentNoteId: () => {
        return get().tabs.find((t) => t.id === get().currentTab)?.session
          ?.noteId;
      }
    }),
    {
      name: "tab-storage-v5",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

globalThis.tabStore = useTabStore;

export const TabContext = createContext<TabItem>({} as TabItem);

export const useTabContext = () => {
  const tab = useContext(TabContext);

  return tab;
};
