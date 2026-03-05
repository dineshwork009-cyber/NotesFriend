import { PlaywrightTestConfig } from "@playwright/test";

const IS_CI = !!process.env.CI;

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run start",
    port: 3000,
    timeout: 60 * 1000,
    reuseExistingServer: false
  },
  // Look for test files in thcleare "tests" directory, relative to this configuration file
  testDir: "__e2e__",

  timeout: IS_CI ? 60 * 1000 : 30 * 1000,
  workers: IS_CI ? 2 : 2,
  reporter: "list",
  retries: IS_CI ? 1 : 0,
  fullyParallel: true,
  preserveOutput: "failures-only",
  outputDir: "test-results",
  use: {
    headless: true,
    acceptDownloads: true,

    // Artifacts
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retry-with-video"
  }
};

export default config;
