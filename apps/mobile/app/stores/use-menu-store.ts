import {
  Color,
  Notebook,
  SideBarHideableSection,
  SideBarSection,
  Tag
} from "@notesfriend/core";
import { create } from "zustand";
import { db } from "../common/database";

export interface MenuStore {
  menuPins: (Notebook | Tag)[];
  colorNotes: Color[];
  setMenuPins: () => void;
  setColorNotes: () => void;
  clearAll: () => void;
  loadingShortcuts: boolean;
  loadingColors: boolean;
  order: Record<SideBarSection, string[]>;
  hiddenItems: Record<SideBarHideableSection, string[]>;
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  menuPins: [],
  colorNotes: [],
  loadingShortcuts: true,
  loadingColors: true,
  order: {
    colors: [],
    shortcuts: [],
    routes: []
  },
  hiddenItems: {
    colors: [],
    routes: []
  },
  setMenuPins: () => {
    db.shortcuts.resolved().then((shortcuts) => {
      set({ menuPins: [...(shortcuts as [])], loadingShortcuts: false });
    });
    const sections = ["colors", "shortcuts", "routes"];
    const order: Record<SideBarSection, string[]> = {
      colors: [],
      shortcuts: [],
      routes: []
    };
    const hiddenItems: Record<SideBarHideableSection, string[]> = {
      colors: [],
      routes: []
    };
    for (const section of sections) {
      order[section as SideBarSection] = db.settings.getSideBarOrder(
        section as SideBarSection
      );
      hiddenItems[section as SideBarHideableSection] =
        db.settings.getSideBarHiddenItems(section as SideBarHideableSection);
    }

    if (
      JSON.stringify(get().order || {}) !== JSON.stringify(order || {}) ||
      JSON.stringify(get().hiddenItems || {}) !==
        JSON.stringify(hiddenItems || {})
    ) {
      set({
        order: order,
        hiddenItems: hiddenItems
      });
    }
  },
  setColorNotes: () => {
    db.colors?.all
      .items(undefined, {
        sortBy: "dateCreated",
        sortDirection: "asc"
      })
      .then((colors) => {
        set({
          colorNotes: colors,
          loadingColors: false
        });
      });
  },
  clearAll: () => set({ menuPins: [], colorNotes: [] })
}));
