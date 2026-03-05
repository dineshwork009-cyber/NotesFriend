import createStore from "../common/store";
import BaseStore from "./index";

class SelectionStore extends BaseStore<SelectionStore> {
  selectedItems: string[] = [];
  shouldSelectAll = false;
  isSelectionMode = false;

  toggleSelectionMode = (toggleState?: boolean) => {
    this.set((state) => {
      const isSelectionMode =
        toggleState !== undefined ? toggleState : !state.isSelectionMode;
      state.isSelectionMode = isSelectionMode;
      state.shouldSelectAll = false;
      state.selectedItems = [];
    });
  };

  selectItem = (id: string) => {
    this.set((state) => {
      if (!state.selectedItems.includes(id)) {
        state.selectedItems.push(id);
      }
    });
  };

  deselectItem = (id: string) => {
    this.set((state) => {
      const itemAt = state.selectedItems.indexOf(id);
      if (itemAt >= 0) {
        state.selectedItems.splice(itemAt, 1);
      }
    });

    if (this.get().selectedItems.length <= 0) {
      this.toggleSelectionMode();
    }
  };

  isSelected = (id: string) => {
    return this.get().selectedItems.indexOf(id) > -1;
  };

  setSelectedItems = (ids: string[]) => {
    this.set((state) => (state.selectedItems = ids));
  };

  selectAll = () => {
    if (!this.get().isSelectionMode) return;
    this.set((state) => (state.shouldSelectAll = true));
  };
}

const [useStore, store] = createStore<SelectionStore>(
  (set, get) => new SelectionStore(set, get)
);
export { useStore, store };
