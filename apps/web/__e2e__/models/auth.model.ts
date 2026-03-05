import { Locator, Page } from "@playwright/test";
import { getTestId } from "../utils";
import { authenticator } from "otplib";

type User = {
  email: string;
  password: string;
  key?: string;
  totpSecret: string;
};

export class AuthModel {
  private readonly page: Page;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly codeInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator(getTestId("email"));
    this.passwordInput = page.locator(getTestId("password"));
    this.codeInput = page.locator(getTestId("code"));
    this.submitButton = page.locator(getTestId("submitButton"));
  }

  async goto() {
    await this.page.goto("/login");
    await this.ready();
  }

  async ready() {
    await this.submitButton.waitFor({ state: "visible" });
    return true;
  }

  async login(user: Partial<User>) {
    if (!user.email && !user.password) return;

    if (user.email) {
      await this.emailInput.fill(user.email);
      await this.submitButton.click();
    }

    if (user.totpSecret) {
      const token = authenticator.generate(user.totpSecret);
      await this.codeInput.fill(token);

      await this.submitButton.click();
    }

    if (user.password) {
      await this.passwordInput.fill(user.password);

      await this.submitButton.click();
    }

    await this.page.locator(getTestId("close-plans")).click();

    await this.page
      .locator(getTestId("sync-status-synced"))
      .waitFor({ state: "visible" });
  }
}
