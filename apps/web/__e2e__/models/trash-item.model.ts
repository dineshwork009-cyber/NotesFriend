import { Locator } from "@playwright/test";
import { getTestId } from "../utils";
import { BaseItemModel } from "./base-item.model";
import { ContextMenuModel } from "./context-menu.model";

export class TrashItemModel extends BaseItemModel {
  private readonly contextMenu: ContextMenuModel;

  constructor(locator: Locator) {
    super(locator);
    this.contextMenu = new ContextMenuModel(locator.page());
  }

  async restore() {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("restore");
    await this.contextMenu.close();
  }

  async delete() {
    await this.contextMenu.open(this.locator);
    await this.contextMenu.clickOnItem("delete");

    await this.locator.page().locator(getTestId("dialog-yes")).click();
  }
}
