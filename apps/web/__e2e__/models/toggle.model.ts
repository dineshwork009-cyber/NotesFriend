import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";

export enum TOGGLE_STATES {
  ON = "on",
  OFF = "off"
}

export class ToggleModel {
  private readonly toggle: Locator;
  constructor(private readonly page: Page, private readonly id: string) {
    this.toggle = page.locator(getTestId(id));
  }

  async on(wait = true) {
    if (!(await this.isToggled())) {
      await this.toggle.click();
      if (wait) await this.waitUntilToggleState(this.toggle, TOGGLE_STATES.ON);
    }
  }

  async off(wait = true) {
    if (await this.isToggled()) {
      await this.toggle.click();
      if (wait) await this.waitUntilToggleState(this.toggle, TOGGLE_STATES.OFF);
    }
  }

  async isToggled() {
    return await this.getToggleState(this.toggle, TOGGLE_STATES.ON).isVisible();
  }

  private async waitUntilToggleState(locator: Locator, state: TOGGLE_STATES) {
    if (this.id.startsWith("menu-button")) await this.page.waitForTimeout(200);
    else
      await this.getToggleState(locator, state).waitFor({ state: "visible" });
  }

  private getToggleState(locator: Locator, state: TOGGLE_STATES) {
    return locator.locator(getTestId(`toggle-state-${state}`));
  }

  waitFor() {
    return this.toggle.waitFor();
  }
}
