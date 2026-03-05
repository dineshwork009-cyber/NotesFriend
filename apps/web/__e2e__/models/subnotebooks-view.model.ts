import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { BaseViewModel } from "./base-view.model";
import { NotebookItemModel } from "./notebook-item.model";
import { Notebook } from "./types";
import { fillNotebookDialog } from "./utils";

export class SubnotebooksViewModel extends BaseViewModel {
  private readonly createButton: Locator;

  constructor(readonly page: Page) {
    super(page, "subnotebooks", "subnotebooks");
    this.createButton = page
      .locator(getTestId("subnotebooks-action-button"))
      .first();
  }

  async createNotebook(notebook: Notebook) {
    await this.createButton.click();

    await fillNotebookDialog(this.page, notebook);

    await this.waitForItem(notebook.title);
    return await this.findNotebook(notebook);
  }

  async findNotebook(notebook: Partial<Notebook>) {
    for await (const item of this.iterateItems()) {
      const notebookModel = new NotebookItemModel(item);
      if ((await notebookModel.getTitle()) === notebook.title)
        return notebookModel;
    }
    return undefined;
  }
}
