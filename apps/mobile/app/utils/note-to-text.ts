import { NoteContent, Note } from "@notesfriend/core";
import { db } from "../common/database";

export async function convertNoteToText(note: Note, disableTemplate?: boolean) {
  const locked = await db.vaults.itemExists(note);
  if (locked) {
    return await db.notes.export(note.id, {
      contentItem: (note as Note & { content: NoteContent<false> }).content,
      disableTemplate,
      format: "txt"
    });
  }

  return await db.notes.export(note.id, {
    disableTemplate,
    format: "txt"
  });
}
