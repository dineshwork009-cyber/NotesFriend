import { Item } from "@notesfriend/core";
import { create } from "zustand";

export type SelectionState = "intermediate" | "selected" | "deselected";
export type ItemSelection = Record<string, SelectionState | undefined>;
export interface SelectionStore {
  selection: ItemSelection;
  setSelection: (state: ItemSelection) => void;
  multiSelect: boolean;
  toggleMultiSelect: (multiSelect: boolean) => void;
  initialState: ItemSelection;
  canEnableMultiSelectMode: boolean;
  markAs: (item: Item, state: SelectionState | undefined) => void;
  reset: () => void;
  enabled?: boolean;
  getSelectedItemIds: () => string[];
  getDeselectedItemIds: () => string[];
  selectAll?: () => void;
}

export function createItemSelectionStore(
  multiSelectMode = false,
  enabled = true
) {
  return create<SelectionStore>((set, get) => ({
    selection: {},
    setSelection: (state) => {
      set({
        selection: state
      });
    },
    reset: () => {
      set({
        selection: { ...get().initialState }
      });
    },
    enabled: enabled,
    canEnableMultiSelectMode: multiSelectMode,
    initialState: {},
    markAs: (item, state) => {
      set({
        selection: {
          ...get().selection,
          [item.id]:
            state === "deselected"
              ? get().initialState === undefined
                ? undefined
                : "deselected"
              : state
        }
      });
    },
    multiSelect: false,
    toggleMultiSelect: () => {
      if (!get().canEnableMultiSelectMode) return;
      set({
        multiSelect: !get().multiSelect
      });
    },
    getSelectedItemIds: () => {
      const selected: string[] = [];

      if (!get().selection) return selected;

      for (const item in get().selection) {
        if (get().selection[item] === "selected") {
          selected.push(item);
        }
      }
      return selected;
    },
    getDeselectedItemIds: () => {
      const deselected: string[] = [];
      if (!get().selection) return deselected;
      for (const item in get().selection) {
        if (get().selection[item] === "deselected") {
          deselected.push(item);
        }
      }
      return deselected;
    }
  }));
}
