import { defineConfig } from "vitest/config";

const IS_E2E = process.env.IS_E2E === "true";
const IS_CI = !!process.env.CI;

export default defineConfig({
  test: {
    globalSetup: ["./__tests__/setup/global.setup.ts"],
    setupFiles: ["./__tests__/setup/test.setup.ts"],
    coverage: {
      reporter: ["text", "html"],
      exclude: ["src/utils/templates/html/languages/*.js"],
      include: ["src/**/*.ts"]
    },
    retry: IS_CI ? 1 : 0,
    exclude: ["__benches__/**/*.bench.ts"],
    include: [
      ...(IS_E2E ? ["__e2e__/**/*.test.{js,ts}"] : []),
      "__tests__/**/*.test.{js,ts}",
      "src/**/*.test.{js,ts}"
    ],
    benchmark: {
      include: ["__benches__/**/*.bench.ts"]
    }
  }
});
