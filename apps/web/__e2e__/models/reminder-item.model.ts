import { Reminder } from "@notesfriend/core";
import { Locator } from "@playwright/test";
import { getTestId } from "../utils";
import { BaseItemModel } from "./base-item.model";
import { ContextMenuModel } from "./context-menu.model";
import { confirmDialog, fillReminderDialog } from "./utils";

export class ReminderItemModel extends BaseItemModel {
  private readonly contextMenu: ContextMenuModel;
  constructor(locator: Locator) {
    super(locator);
    this.contextMenu = new ContextMenuModel(this.page);
  }

  getReminderTime() {
    return this.locator.locator(getTestId("reminder-time")).textContent();
  }

  getRecurringMode() {
    return this.locator.locator(getTestId("recurring-mode")).textContent();
  }

  isDisabled() {
    return this.locator.locator(getTestId("disabled")).isVisible();
  }

  async delete() {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("delete");

    await confirmDialog(this.page.locator(getTestId("confirm-dialog")));
    await this.waitFor("detached");
  }

  async edit(reminder: Partial<Reminder>) {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("edit");

    await fillReminderDialog(this.page, reminder);
  }

  async toggle() {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("toggle");
  }
}
