import { Page } from "@playwright/test";
import { BaseViewModel } from "./base-view.model";
import { ItemModel } from "./item.model";
import { Item } from "./types";

export class SearchViewModel extends BaseViewModel {
  constructor(page: Page, type: string) {
    super(page, "general", type);
  }

  async findItem(item: Item) {
    const titleToCompare = item.title;
    for await (const _item of this.iterateItems()) {
      const itemModel = new ItemModel(_item, "tag");
      const title = await itemModel.getTitle();
      if (title === titleToCompare) return itemModel;
    }
    return undefined;
  }
}
