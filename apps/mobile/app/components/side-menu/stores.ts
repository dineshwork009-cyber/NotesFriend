import { createNotebookTreeStores } from "../../stores/create-notebook-tree-stores";
import { createItemSelectionStore } from "../../stores/item-selection-store";

export const {
  useNotebookExpandedStore: useSideMenuNotebookExpandedStore,
  useNotebookSelectionStore: useSideMenuNotebookSelectionStore,
  useNotebookTreeStore: useSideMenuNotebookTreeStore
} = createNotebookTreeStores(true, false);

export const useSideMenuTagsSelectionStore = createItemSelectionStore(
  true,
  false
);
