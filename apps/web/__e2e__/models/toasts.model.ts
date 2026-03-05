import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";

export class ToastsModel {
  private readonly toasts: Locator;

  constructor(page: Page) {
    this.toasts = page.locator(".toasts-container > div");
    // this.toastMessage = this.toast.locator(getTestId("toast-message"));
  }

  count() {
    return this.toasts.count();
  }

  async waitForToast(message: string) {
    await this.toasts
      .locator(getTestId("toast-message"), { hasText: message })
      .waitFor();
    return true;
  }
}
