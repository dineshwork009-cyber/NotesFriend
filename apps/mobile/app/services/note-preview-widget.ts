import { Note } from "@notesfriend/core";
import { db } from "../common/database";
import { NotesfriendModule } from "../utils/notesfriend-module";
import { Platform } from "react-native";

let timer: NodeJS.Timeout;
export const NotePreviewWidget = {
  updateNotes: () => {
    if (Platform.OS !== "android") return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const noteIds = await NotesfriendModule.getWidgetNotes();
      for (const id of noteIds) {
        const newNote = await db.notes.note(id);
        if (!newNote) continue;

        NotesfriendModule.updateWidgetNote(id, JSON.stringify(newNote));
      }
    }, 500);
  },
  updateNote: async (id: string, note: Note) => {
    if (Platform.OS !== "android") return;
    if (id && (await NotesfriendModule.hasWidgetNote(id))) {
      NotesfriendModule.updateWidgetNote(id, JSON.stringify(note));
    }
  }
};
