import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";

export class BaseItemModel {
  protected readonly page: Page;
  private readonly titleText: Locator;
  readonly descriptionText: Locator;

  constructor(readonly locator: Locator) {
    this.page = locator.page();
    this.titleText = this.locator.locator(getTestId(`title`));
    this.descriptionText = this.locator.locator(getTestId(`description`));
  }

  async isSelected() {
    return (await this.locator.getAttribute("class"))?.includes("selected");
  }

  async isFocused() {
    return await this.locator.evaluate((el) => el === document.activeElement);
  }

  async click(options?: { middleClick?: boolean }) {
    if (!(await this.locator.isVisible()))
      await this.locator.scrollIntoViewIfNeeded();
    await this.locator.click({
      button: options?.middleClick ? "middle" : "left"
    });
  }

  async getId() {
    return (await this.locator.getAttribute("id"))?.replace("id_", "");
  }

  async getTitle() {
    if (await this.titleText.isVisible())
      return (await this.titleText.textContent()) || "";
    return "";
  }

  async getDescription() {
    if (await this.descriptionText.isVisible())
      return (await this.descriptionText.textContent()) || "";
    return "";
  }

  isPresent() {
    return this.locator.isVisible();
  }

  waitFor(state: "attached" | "detached" | "visible" | "hidden") {
    return this.locator.waitFor({ state });
  }
}
