import { test, expect } from "@playwright/test";
import { AppModel } from "./models/app.model";
import { getTestId } from "./utils";

test("closing search via close button should clear query", async ({ page }) => {
  const app = new AppModel(page);
  await app.goto();
  const searchInput = page.locator(getTestId("search-input"));
  const searchButton = page.locator(getTestId("search-button"));

  await searchInput.focus();
  await page.keyboard.type("test");
  await page.waitForTimeout(500);
  await searchButton.click();

  expect(await searchInput.inputValue()).toBe("");
});

test("closing search via keyboard escape button should clear query", async ({
  page
}) => {
  const app = new AppModel(page);
  await app.goto();
  const searchInput = page.locator(getTestId("search-input"));

  await searchInput.focus();
  await page.keyboard.type("test");
  await page.waitForTimeout(500);
  await page.keyboard.press("Escape");

  expect(await searchInput.inputValue()).toBe("");
});
