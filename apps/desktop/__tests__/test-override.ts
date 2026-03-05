import { test as vitestTest, TestContext } from "vitest";
import { buildAndLaunchApp, Fixtures, TestOptions } from "./utils";
import { mkdir, rm } from "fs/promises";
import path from "path";
import slugify from "slugify";

export const test = vitestTest.extend<Fixtures>({
  options: { version: "3.0.0" } as TestOptions,
  ctx: async ({ options }, use) => {
    const ctx = await buildAndLaunchApp(options);
    await use(ctx);
  }
});

export async function testCleanup(context: TestContext) {
  const ctx = (context.task.context as unknown as Fixtures).ctx;
  if (context.task.result?.state === "fail") {
    await mkdir("test-results", { recursive: true });
    await ctx.page.screenshot({
      path: path.join(
        "test-results",
        `${slugify(context.task.name)}-${process.platform}-${
          process.arch
        }-error.png`
      )
    });
  }
  await ctx.app.close();
  await rm(ctx.userDataDir, {
    force: true,
    recursive: true,
    maxRetries: 3,
    retryDelay: 5000
  }).catch(() => {
    /*ignore */
  });
  await rm(ctx.outputDir, {
    force: true,
    recursive: true,
    maxRetries: 3,
    retryDelay: 5000
  }).catch(() => {
    /*ignore */
  });
}
