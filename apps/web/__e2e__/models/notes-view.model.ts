import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { BaseViewModel } from "./base-view.model";
import { EditorModel } from "./editor.model";
import { NoteItemModel } from "./note-item.model";

type Note = {
  title: string;
  content: string;
};

export class NotesViewModel extends BaseViewModel {
  private readonly createButton: Locator;
  readonly editor: EditorModel;

  constructor(
    page: Page,
    pageId: "home" | "notes" | "favorites" | "notebook",
    listType: string
  ) {
    super(page, pageId, listType);
    this.createButton = page.locator(getTestId(`create-new-note`));
    this.editor = new EditorModel(page);
  }

  async newNote() {
    await this.createButton.first().click();
    await this.editor.waitForUnloading();
  }

  async createNote(note: Partial<Note>) {
    await this.newNote();
    if (note.title) await this.editor.setTitle(note.title);
    if (note.content) await this.editor.setContent(note.content);

    await this.editor.waitForSaving();
    if (note.title) await this.waitForItem(note.title);
    return await this.findNote(note);
  }

  async findNote(note: Partial<Note>) {
    for await (const item of this.iterateItems()) {
      const noteModel = new NoteItemModel(item);
      if ((await noteModel.getTitle()) === note.title) return noteModel;
    }
    return undefined;
  }
}
