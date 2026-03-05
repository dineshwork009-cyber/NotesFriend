import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { NotePropertiesModel } from "./note-properties.model";
import { SessionHistoryPreviewModel } from "./session-history-preview-model";

export class SessionHistoryItemModel {
  private readonly title: Locator;
  private readonly page: Page;
  private readonly locked: Locator;
  constructor(
    private readonly properties: NotePropertiesModel,
    private readonly locator: Locator
  ) {
    this.page = locator.page();
    this.title = locator.locator(getTestId("title"));
    this.locked = locator.locator(getTestId("locked"));
  }

  async getTitle() {
    return await this.title.textContent();
  }

  async open() {
    await this.properties.open();
    await this.locator.click();
    return new SessionHistoryPreviewModel(this.locator);
  }

  async isLocked() {
    await this.properties.open();
    const state = await this.locked.isVisible();
    await this.properties.close();
    return state;
  }
}
