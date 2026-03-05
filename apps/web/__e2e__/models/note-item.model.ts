import { Locator } from "@playwright/test";
import { getTestId } from "../utils";
import { BaseItemModel } from "./base-item.model";
import { EditorModel } from "./editor.model";
import {
  NoteContextMenuModel,
  NotePropertiesModel
} from "./note-properties.model";
import { iterateList } from "./utils";

export class NoteItemModel extends BaseItemModel {
  readonly properties: NotePropertiesModel;
  readonly contextMenu: NoteContextMenuModel;
  private readonly editor: EditorModel;
  constructor(locator: Locator) {
    super(locator);
    this.properties = new NotePropertiesModel(this.page, locator);
    this.contextMenu = new NoteContextMenuModel(this.page, locator);
    this.editor = new EditorModel(this.page);
  }

  async openNote(openInNewTab?: boolean) {
    await this.click({ middleClick: openInNewTab });
    const title = await this.getTitle();
    await this.editor.waitForLoading(title);
  }

  async openLockedNote(password: string) {
    if (!(await this.contextMenu.isLocked())) return;

    await this.page
      .locator(".active")
      .locator(getTestId("unlock-note-password"))
      .fill(password);
    await this.page
      .locator(".active")
      .locator(getTestId("unlock-note-submit"))
      .click();

    const title = await this.getTitle();
    await this.editor.waitForLoading(title);
  }

  async isFavorite() {
    await this.locator
      .locator(getTestId("favorite"))
      .waitFor({ state: "visible" });
    return true;
  }

  async getTags() {
    const tags: string[] = [];
    for await (const item of iterateList(
      this.locator.locator(getTestId("tag-item"))
    )) {
      const title = await item.textContent();
      if (title) tags.push(title.replace("#", ""));
    }
    return tags;
  }

  async isLockedNotePasswordFieldVisible() {
    return this.page
      .locator(".active")
      .locator(getTestId("unlock-note-password"))
      .isVisible();
  }
}
