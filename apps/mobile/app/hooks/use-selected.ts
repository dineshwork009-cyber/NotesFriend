import { Item } from "@notesfriend/core";
import { useSelectionStore } from "../stores/use-selection-store";

export default function useIsSelected(item: Item) {
  const selectionMode = useSelectionStore((state) => state.selectionMode);
  const selectedItemsList = useSelectionStore(
    (state) => state.selectedItemsList
  );
  const selected =
    selectionMode &&
    selectedItemsList.findIndex((selectedId) => selectedId === item.id) > -1;

  function toggle() {
    if (useSelectionStore.getState().selectionMode !== item.type) {
      useSelectionStore.getState().setSelectionMode(item.type);
    }
    useSelectionStore.getState().setSelectedItem(item.id);
  }

  return [selected, toggle];
}
