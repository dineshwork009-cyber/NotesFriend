import { Locator } from "@playwright/test";
import { BaseItemModel } from "./base-item.model";
import { ContextMenuModel } from "./context-menu.model";
import { NotesViewModel } from "./notes-view.model";
import { Item } from "./types";
import { confirmDialog, fillItemDialog } from "./utils";
import { getTestId } from "../utils";

export class ItemModel extends BaseItemModel {
  private readonly contextMenu: ContextMenuModel;
  constructor(locator: Locator, private readonly id: "topic" | "tag") {
    super(locator);
    this.contextMenu = new ContextMenuModel(this.page);
  }

  async open() {
    await this.locator.click();
    return new NotesViewModel(
      this.page,
      this.id === "topic" ? "notebook" : "notes",
      "notes"
    );
  }

  async delete() {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("delete");

    await this.waitFor("detached");
  }

  async deleteWithNotes(deleteContainedNotes = false) {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("delete");

    if (deleteContainedNotes)
      await this.page.locator("#deleteContainingNotes").check({ force: true });

    await confirmDialog(this.page.locator(getTestId("confirm-dialog")));
    await this.waitFor("detached");
  }

  async editItem(item: Item) {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("edit");

    await fillItemDialog(this.page, item);
  }

  async createShortcut() {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("shortcut");
  }

  async removeShortcut() {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("shortcut");
  }

  async isShortcut() {
    await this.contextMenu.open(this.locator);
    const state =
      (await this.contextMenu.getItem("shortcut").textContent()) ===
      "Remove shortcut";
    await this.contextMenu.close();
    return state;
  }

  async setAsDefault() {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("set-as-default");
  }
}
