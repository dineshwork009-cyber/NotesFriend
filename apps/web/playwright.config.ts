import { PlaywrightTestConfig } from "@playwright/test";

const IS_CI = !!process.env.CI;

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run start:test",
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
    baseURL: "http://localhost:3000/",
    headless: true,
    acceptDownloads: true,

    // Artifacts
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retry-with-video",

    viewport: {
      width: 1280,
      height: 720
    }
  },
  projects: IS_CI
    ? [
        {
          name: "Chromium",
          use: {
            browserName: "chromium"
          }
        }
      ]
    : [
        {
          name: "Chromium",
          use: {
            browserName: "chromium",
            permissions: ["notifications"]
          }
        }
        // {
        //   name: "Firefox",
        //   use: {
        //     browserName: "firefox",
        //     permissions: ["notifications"]
        //   }
        // },we
        // {
        //   name: "WebKit",
        //   use: {
        //     browserName: "webkit"
        //   }
        // }
      ]
};

export default config;
