import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { ContextMenuModel } from "./context-menu.model";

export class TabItemModel {
  private readonly closeButton: Locator;
  readonly contextMenu: TabContextMenuModel;
  readonly titleElement: Locator;

  constructor(readonly locator: Locator, page: Page) {
    this.closeButton = locator.locator(getTestId("tab-close-button"));
    this.contextMenu = new TabContextMenuModel(page, locator);
    this.titleElement = locator.locator(getTestId("tab-title"));
  }

  async getId() {
    const testId = await this.locator.getAttribute("data-test-id");
    return testId?.replace("tab-", "");
  }

  async click() {
    return this.locator.click();
  }

  async title() {
    return this.titleElement.textContent();
  }

  async isActive() {
    const classList = await this.locator.getAttribute("class");
    return !!classList?.includes("active");
  }

  close() {
    return this.closeButton.click();
  }
}

class TabContextMenuModel {
  private readonly menu: ContextMenuModel;
  constructor(page: Page, private readonly tabLocator: Locator) {
    this.menu = new ContextMenuModel(page);
  }

  async pin() {
    await this.open();
    await this.menu.clickOnItem("pin");
  }

  async open() {
    await this.menu.open(this.tabLocator);
  }

  async getRevealInListItem() {
    await this.open();
    return this.menu.getItem("reveal-in-list");
  }

  async save() {
    await this.open();
    return this.menu.clickOnItem("save");
  }
}
