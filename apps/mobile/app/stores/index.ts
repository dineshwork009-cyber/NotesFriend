import { DatabaseLogger, db } from "../common/database";
import { eSendEvent } from "../services/event-manager";
import Navigation from "../services/navigation";
import { NotePreviewWidget } from "../services/note-preview-widget";
import Notifications from "../services/notifications";
import { eAfterSync } from "../utils/events";
import { NotesfriendModule, ShortcutInfo } from "../utils/notesfriend-module";
import { useFavoriteStore } from "./use-favorite-store";
import { useMenuStore } from "./use-menu-store";
import { useMonographStore } from "./use-monograph-store";
import { useNotebookStore } from "./use-notebook-store";
import { useNoteStore } from "./use-notes-store";
import { useRelationStore } from "./use-relation-store";
import { useReminderStore } from "./use-reminder-store";
import { useTagStore } from "./use-tag-store";
import { useTrashStore } from "./use-trash-store";
import { useUserStore } from "./use-user-store";

async function syncShortcuts(result: ShortcutInfo[]) {
  try {
    for (let shortcut of result) {
      switch (shortcut.type) {
        case "note":
          {
            const note = await db.notes.note(shortcut.id);
            if (!note) {
              NotesfriendModule.removeShortcut(shortcut.id);
            } else if (note.title !== shortcut.title) {
              NotesfriendModule.updateShortcut(
                shortcut.id,
                "note",
                note.title,
                note.headline
              );
            }
          }
          break;
        case "notebook":
          {
            const notebook = await db.notebooks.notebook(shortcut.id);
            if (!notebook) {
              NotesfriendModule.removeShortcut(shortcut.id);
            } else if (notebook.title !== shortcut.title) {
              NotesfriendModule.updateShortcut(
                shortcut.id,
                "notebook",
                notebook.title,
                notebook.description
              );
            }
          }
          break;
        case "tag":
          {
            const tag = await db.tags.tag(shortcut.id);
            if (!tag) {
              NotesfriendModule.removeShortcut(shortcut.id);
            } else if (tag.title !== shortcut.title) {
              NotesfriendModule.updateShortcut(
                shortcut.id,
                "tag",
                tag.title,
                tag.title
              );
            }
          }
          break;
        case "color":
          {
            const color = await db.colors.color(shortcut.id);
            if (!color) {
              NotesfriendModule.removeShortcut(shortcut.id);
            } else if (color.title !== shortcut.title) {
              NotesfriendModule.updateShortcut(
                shortcut.id,
                "color",
                color.title,
                color.title,
                color.colorCode
              );
            }
          }
          break;
      }
    }
  } catch (e) {
    DatabaseLogger.error(
      e as Error,
      "Error while syncing homescreen shortcuts"
    );
  }
}

export function initAfterSync(type: "full" | "send" = "send") {
  if (type === "full") {
    Navigation.queueRoutesForUpdate();
    // Whenever sync completes, try to reschedule
    // any new/updated reminders.
    useRelationStore.getState().update();
    useMenuStore.getState().setColorNotes();
    useMenuStore.getState().setMenuPins();
    useUserStore.setState({
      profile: db.settings.getProfile()
    });
  }

  Notifications.setupReminders(true);
  NotePreviewWidget.updateNotes();
  eSendEvent(eAfterSync);

  NotesfriendModule.getAllShortcuts()
    .then(syncShortcuts)
    .catch((e) => {
      DatabaseLogger.log(e);
    });
}

export async function initialize() {}

export function clearAllStores() {
  useNotebookStore.getState().clear();
  useTagStore.getState().clear();
  useFavoriteStore.getState().clear();
  useMenuStore.getState().clearAll();
  useNoteStore.getState().clear();
  useMenuStore.getState().clearAll();
  useTrashStore.getState().clear();
  useReminderStore.getState().clear();
  useMonographStore.getState().clear();
}
