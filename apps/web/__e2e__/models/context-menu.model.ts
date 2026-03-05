import { Page, Locator } from "@playwright/test";
import { getTestId } from "../utils";

export class ContextMenuModel {
  readonly menuContainer: Locator;
  readonly titleText: Locator;
  constructor(private readonly page: Page) {
    this.menuContainer = this.page.locator(getTestId(`menu-container`));
    this.titleText = this.page.locator(getTestId(`menu-title`));
  }

  async title() {
    if (!(await this.titleText.isVisible())) return null;
    return await this.titleText.textContent();
  }

  async open(
    locator: Locator,
    button: "left" | "right" | "middle" | undefined = "right"
  ) {
    await locator.click({ button });
    await this.menuContainer.waitFor();
  }

  async clickOnItem(id: string) {
    await this.getItem(id).click();
  }

  getItem(id: string) {
    return this.page.locator(getTestId(`menu-button-${id}`));
  }

  async hasItem(id: string) {
    return (
      (await this.getItem(id).isVisible()) &&
      (await this.getItem(id).isEnabled())
    );
  }

  async close() {
    await this.page.keyboard.press("Escape");
  }
}
