import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { iterateList } from "./utils";
import { ContextMenuModel } from "./context-menu.model";
import { SortOptions } from "./types";

export class BaseViewModel {
  protected readonly page: Page;
  protected readonly list: Locator;
  private readonly listPlaceholder: Locator;
  private readonly sortByButton: Locator;

  constructor(page: Page, pageId: string, readonly listType: string) {
    this.page = page;
    this.list = page
      .locator(`#${pageId}`)
      .locator(getTestId(`${listType}-list`));

    this.listPlaceholder = page
      .locator(`#${pageId}`)
      .locator(getTestId("list-placeholder"));

    this.sortByButton = this.page.locator(
      // TODO:
      getTestId(`${pageId === "notebook" ? "notes" : pageId}-sort-button`)
    );
  }

  async findGroup(groupName: string) {
    const locator = this.list
      .locator(getTestId(`virtuoso-item-list`, "data-testid"))
      .locator(getTestId("group-header"));

    for await (const item of iterateList(locator)) {
      if (
        (
          await item.locator(getTestId("title")).textContent()
        )?.toLowerCase() === groupName.toLowerCase()
      )
        return item;
    }
    return undefined;
  }

  protected async *iterateItems() {
    await this.waitForList();

    for await (const _item of iterateList(this.items)) {
      const id = await _item.getAttribute("id");
      if (!id) continue;

      yield this.list.locator(`#${id}`);
    }
    return undefined;
  }

  async waitForItem(title: string) {
    await this.list.locator(getTestId("title"), { hasText: title }).waitFor();
  }

  async waitForList() {
    try {
      await this.listPlaceholder.waitFor({ timeout: 1000 });
    } catch {
      await this.list.waitFor();
    }
  }

  async focus() {
    await this.items.nth(0).click();
    await this.items.nth(0).click();
  }

  // async selectAll() {
  //   await this.press("Control+a");
  // }

  // async selectNext() {
  //   await this.press("ArrowDown");
  // }

  async press(key: string) {
    const itemList = this.list.locator(
      getTestId(`virtuoso-item-list`, "data-testid")
    );
    await itemList.press(key);
    await this.page.waitForTimeout(300);
  }

  async sort(sort: SortOptions) {
    const contextMenu: ContextMenuModel = new ContextMenuModel(this.page);

    if (sort.groupBy) {
      await contextMenu.open(this.sortByButton, "left");
      await contextMenu.clickOnItem("groupBy");
      if (!(await contextMenu.hasItem(sort.groupBy))) {
        await contextMenu.close();
        return false;
      }
      await contextMenu.clickOnItem(sort.groupBy);
    }

    await contextMenu.open(this.sortByButton, "left");
    await contextMenu.clickOnItem("sortDirection");
    if (!(await contextMenu.hasItem(sort.orderBy))) {
      await contextMenu.close();
      return false;
    }
    await contextMenu.clickOnItem(sort.orderBy);

    await contextMenu.open(this.sortByButton, "left");
    await contextMenu.clickOnItem("sortBy");
    if (!(await contextMenu.hasItem(sort.sortBy))) {
      await contextMenu.close();
      return false;
    }
    await contextMenu.clickOnItem(sort.sortBy);

    return true;
  }

  get items() {
    return this.list.locator(getTestId("list-item"));
  }

  async isEmpty() {
    return (await this.items.count()) <= 0;
  }
}
