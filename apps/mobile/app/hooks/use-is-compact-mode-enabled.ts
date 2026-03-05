import { ItemType } from "@notesfriend/core";
import { useSettingStore } from "../stores/use-setting-store";

export function useIsCompactModeEnabled(dataType: ItemType) {
  const [notebooksListMode, notesListMode] = useSettingStore((state) => [
    state.settings.notebooksListMode,
    state.settings.notesListMode
  ]);

  if (dataType !== "note" && dataType !== "notebook") return false;

  const listMode = dataType === "notebook" ? notebooksListMode : notesListMode;

  return listMode === "compact";
}
