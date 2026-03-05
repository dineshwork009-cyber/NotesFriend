import hotkeys from "hotkeys-js";
import { useEditorStore } from "../stores/editor-store";
import { useStore as useSearchStore } from "../stores/search-store";
import { useEditorManager } from "../components/editor/manager";
import { CommandPaletteDialog } from "../dialogs/command-palette";
import { hashNavigate } from "../navigation";
import { getKeybinding, keybindings } from "@notesfriend/common";
import { KeyboardShortcutsDialog } from "../dialogs/keyboard-shortcuts-dialog";
import { isMac } from "../utils/platform";

function isInEditor(e: KeyboardEvent) {
  return (
    e.target instanceof HTMLElement && !!e.target?.closest(".editor-container")
  );
}

const actions: Partial<
  Record<keyof typeof keybindings, (() => void) | ((e: KeyboardEvent) => void)>
> = {
  nextTab: () => useEditorStore.getState().focusNextTab(),
  previousTab: () => useEditorStore.getState().focusPreviousTab(),
  newTab: () => useEditorStore.getState().addTab(),
  newNote: () => useEditorStore.getState().newSession(),
  closeActiveTab: () => {
    const activeTab = useEditorStore.getState().getActiveTab();
    if (activeTab?.pinned) {
      useEditorStore.getState().focusLastActiveTab();
      return;
    }
    useEditorStore.getState().closeActiveTab();
  },
  closeAllTabs: () => useEditorStore.getState().closeAllTabs(),
  searchInNotes: (e: KeyboardEvent) => {
    if (isInEditor(e)) {
      const activeSession = useEditorStore.getState().getActiveSession();
      if (activeSession?.type === "readonly") {
        e.preventDefault();
        const editor = useEditorManager.getState().getEditor(activeSession.id);
        editor?.editor?.startSearch();
      }
      return;
    }
    e.preventDefault();

    useSearchStore.setState({ isSearching: true, searchType: "notes" });
  },
  openCommandPalette: () => {
    CommandPaletteDialog.close();
    CommandPaletteDialog.show({
      isCommandMode: true
    }).catch(() => {});
  },
  openQuickOpen: () => {
    CommandPaletteDialog.close();
    CommandPaletteDialog.show({
      isCommandMode: false
    }).catch(() => {});
  },
  openSettings: (e) => {
    if (isInEditor(e)) return;
    hashNavigate("/settings", { replace: true });
  },
  openKeyboardShortcuts: () => KeyboardShortcutsDialog.show({})
};

export function registerKeyMap() {
  hotkeys.filter = function () {
    return true;
  };

  Object.entries(actions).forEach(([id, action]) => {
    const keys = getKeybinding(
      id as keyof typeof keybindings,
      IS_DESKTOP_APP,
      isMac()
    );
    if (!keys || keys.length === 0) return;

    hotkeys(keys.join(","), (e) => {
      e.preventDefault();
      action(e);
    });
  });
}
