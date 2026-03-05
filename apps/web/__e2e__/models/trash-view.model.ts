import { Page } from "@playwright/test";
import { getTestId } from "../utils";
import { BaseViewModel } from "./base-view.model";
import { TrashItemModel } from "./trash-item.model";

export class TrashViewModel extends BaseViewModel {
  constructor(page: Page) {
    super(page, "trash", "trash");
  }

  async findItem(title: string) {
    for await (const item of this.iterateItems()) {
      if ((await item.locator(getTestId("title")).textContent()) === title)
        return new TrashItemModel(item);
    }
    return undefined;
  }
}
