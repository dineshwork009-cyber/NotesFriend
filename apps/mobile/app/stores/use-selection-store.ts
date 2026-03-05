import { ItemType } from "@notesfriend/core";
import { create } from "zustand";

export interface SelectionStore {
  selectedItemsList: Array<string>;
  selectionMode?: ItemType;
  setAll: (all: Array<string>) => void;
  setSelectionMode: (mode?: ItemType) => void;
  setSelectedItem: (item: string) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selectedItemsList: [],
  selectionMode: undefined,
  setAll: (all) => {
    set({ selectedItemsList: all });
  },
  setSelectionMode: (mode) => {
    set({
      selectionMode: mode,
      selectedItemsList:
        mode === get().selectionMode ? get().selectedItemsList : []
    });
  },
  setSelectedItem: (id) => {
    let selectedItems = get().selectedItemsList as string[];
    const index = selectedItems.findIndex((i) => i === id);
    if (index !== -1) {
      selectedItems.splice(index, 1);
    } else {
      selectedItems.push(id);
    }
    selectedItems = [...new Set(selectedItems)];

    set({
      selectedItemsList: selectedItems,
      selectionMode:
        selectedItems.length === 0 ? undefined : get().selectionMode
    });
  },
  clearSelection: () => {
    set({ selectionMode: undefined, selectedItemsList: [] });
  }
}));
