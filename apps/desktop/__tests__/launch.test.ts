import { testCleanup, test } from "./test-override.js";

test("make sure app loads", async ({
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

  await page.waitForSelector(".ProseMirror");
});
