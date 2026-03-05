import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { NotePropertiesModel } from "./note-properties.model";

export class SessionHistoryPreviewModel {
  private readonly page: Page;
  private readonly diffViewer: Locator;
  readonly firstEditor: Locator;
  readonly secondEditor: Locator;
  private readonly restoreButton: Locator;
  constructor(locator: Locator) {
    this.page = locator.page();
    this.diffViewer = this.page.locator(`.active${getTestId("diff-viewer")}`);
    this.firstEditor = this.diffViewer.locator(getTestId("first-editor"));
    this.secondEditor = this.diffViewer.locator(getTestId("second-editor"));
    this.restoreButton = this.diffViewer.locator(getTestId("restore-session"));
  }

  async unlock(password: string) {
    await this.diffViewer.waitFor();

    if (password) {
      await this.firstEditor
        .locator(getTestId("unlock-note-password"))
        .fill(password);
      await this.firstEditor.locator(getTestId("unlock-note-submit")).click();

      await this.secondEditor
        .locator(getTestId("unlock-note-password"))
        .fill(password);
      await this.secondEditor.locator(getTestId("unlock-note-submit")).click();
    }
  }

  async restore() {
    await this.diffViewer.waitFor();
    await this.restoreButton.click();
  }
}
