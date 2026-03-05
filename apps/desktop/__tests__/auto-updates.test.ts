import { testCleanup, test } from "./test-override.js";
import { writeFile } from "fs/promises";
import { Page } from "playwright";
import { gt, lt } from "semver";
import { describe } from "vitest";

test("update starts downloading if version is outdated", async ({
  ctx: { page },
  expect,
  onTestFinished
}) => {
  onTestFinished(testCleanup);

  await page.waitForSelector("#authForm");
  expect(
    await page.getByRole("button", { name: "Create account" }).isVisible()
  ).toBe(true);

  await page
    .getByRole("button", { name: "Skip & go directly to the app" })
    .click();

  await skipDialog(page);

  await page.waitForSelector(".ProseMirror");

  await page
    .locator(".theme-scope-statusBar")
    .getByRole("button", { name: /updating/i })
    .waitFor({ state: "attached" });
});

test("update is only shown if version is outdated and auto updates are disabled", async ({
  ctx,
  expect,
  onTestFinished
}) => {
  onTestFinished(testCleanup);

  await ctx.app.close();
  await writeFile(
    ctx.configPath,
    JSON.stringify({
      automaticUpdates: false
    })
  );

  await ctx.relaunch();

  const { page } = ctx;

  await page.waitForSelector("#authForm");

  expect(
    await page.getByRole("button", { name: "Create account" }).isVisible()
  ).toBe(true);

  await page
    .getByRole("button", { name: "Skip & go directly to the app" })
    .click();

  await skipDialog(page);

  await page.waitForSelector(".ProseMirror");

  await page
    .locator(".theme-scope-statusBar")
    .getByRole("button", { name: /available/i })
    .waitFor({ state: "attached" });
});

describe("update to stable if it is newer", () => {
  test.scoped({ options: { version: "3.0.0-beta.0" } });
  test("test", async ({ ctx, expect, onTestFinished }) => {
    onTestFinished(testCleanup);

    await ctx.app.close();
    await writeFile(
      ctx.configPath,
      JSON.stringify({
        automaticUpdates: false,
        releaseTrack: "beta"
      })
    );

    await ctx.relaunch();

    const { page } = ctx;

    await page.waitForSelector("#authForm");

    expect(
      await page.getByRole("button", { name: "Create account" }).isVisible()
    ).toBe(true);

    await page
      .getByRole("button", { name: "Skip & go directly to the app" })
      .click();

    await skipDialog(page);

    await page.waitForSelector(".ProseMirror");

    const updateButton = page
      .locator(".theme-scope-statusBar")
      .getByRole("button", { name: /available/i });
    await updateButton.waitFor({ state: "visible" });
    const content = await updateButton.textContent();
    const version = content?.split(" ")?.[0] || "";
    expect(gt(version, "3.0.0-beta.0")).toBe(true);
  });
});

describe("update is not available if it latest stable version is older", () => {
  test.scoped({ options: { version: "99.0.0-beta.0" } });
  test("test", async ({ ctx, expect, onTestFinished }) => {
    onTestFinished(testCleanup);

    await ctx.app.close();
    await writeFile(
      ctx.configPath,
      JSON.stringify({
        automaticUpdates: false,
        releaseTrack: "beta"
      })
    );

    await ctx.relaunch();

    const { page } = ctx;

    await page.waitForSelector("#authForm");

    expect(
      await page.getByRole("button", { name: "Create account" }).isVisible()
    ).toBe(true);

    await page
      .getByRole("button", { name: "Skip & go directly to the app" })
      .click();

    await skipDialog(page);

    await page.waitForSelector(".ProseMirror");

    await page
      .locator(".theme-scope-statusBar")
      .getByRole("button", { name: /checking for updates/i })
      .waitFor({ state: "hidden" });

    expect(
      await page
        .locator(".theme-scope-statusBar")
        .getByRole("button", { name: /available/i })
        .isHidden()
    ).toBe(true);
  });
});

describe("downgrade to stable on switching to stable release track", () => {
  test.scoped({ options: { version: "99.0.0-beta.0" } });
  test("test", async ({ ctx, expect, onTestFinished }) => {
    onTestFinished(testCleanup);

    await ctx.app.close();
    await writeFile(
      ctx.configPath,
      JSON.stringify({
        automaticUpdates: false,
        releaseTrack: "stable"
      })
    );

    await ctx.relaunch();

    const { page } = ctx;

    await page.waitForSelector("#authForm");

    expect(
      await page.getByRole("button", { name: "Create account" }).isVisible()
    ).toBe(true);

    await page
      .getByRole("button", { name: "Skip & go directly to the app" })
      .click();

    await skipDialog(page);

    await page.waitForSelector(".ProseMirror");

    await page
      .locator(".theme-scope-statusBar")
      .getByRole("button", { name: /checking for updates/i })
      .waitFor({ state: "hidden" });

    const updateButton = page
      .locator(".theme-scope-statusBar")
      .getByRole("button", { name: /available/i });
    await updateButton.waitFor({ state: "visible" });
    const content = await updateButton.textContent();
    const version = content?.split(" ")?.[0] || "";
    expect(lt(version, "99.0.0-beta.0")).toBe(true);
  });
});

async function skipDialog(page: Page) {
  try {
    const dialog = page.locator(".ReactModal__Content");
    const positiveButton = dialog.locator(
      "button[data-role='positive-button']"
    );
    const negativeButton = dialog.locator(
      "button[data-role='negative-button']"
    );
    if (await positiveButton.isVisible())
      await positiveButton.click({ timeout: 1000 });
    else if (await negativeButton.isVisible())
      await negativeButton.click({ timeout: 1000 });
  } catch (e) {
    // ignore error
  }
}
