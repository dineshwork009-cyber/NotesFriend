import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { BaseViewModel } from "./base-view.model";
import { ItemModel } from "./item.model";
import { Item } from "./types";
import { fillItemDialog } from "./utils";

export class ItemsViewModel extends BaseViewModel {
  private readonly createButton: Locator;
  constructor(page: Page) {
    super(page, "tags", "tags");
    this.createButton = page.locator(getTestId(`create-tag-button`));
  }

  async createItem(item: Item) {
    await this.createButton.first().click();
    await fillItemDialog(this.page, item);

    await this.waitForItem(item.title);
    return await this.findItem(item);
  }

  async findItem(item: Item) {
    for await (const _item of this.iterateItems()) {
      const itemModel = new ItemModel(_item, "tag");
      const title = await itemModel.getTitle();
      if (title === item.title) return itemModel;
    }
    return undefined;
  }
}
