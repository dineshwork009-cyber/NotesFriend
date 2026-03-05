import { test, expect } from "@playwright/test";
import { AppModel } from "./models/app.model";
import { USER } from "./utils";

test("don't show monographs list to unauthenticated user", async ({ page }) => {
  const app = new AppModel(page);
  await app.goto();

  await expect(
    async () => await app.navigateTo("Monographs")
  ).rejects.toThrowError();
});

test("show monographs list to authenticated user", async ({ page }) => {
  const app = new AppModel(page);
  await app.auth.goto();

  await app.auth.login(USER.CURRENT);

  await app.navigateTo("Monographs");
});
