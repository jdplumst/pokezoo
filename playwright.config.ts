import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import "dotenv/config";
import { env } from "./src/env";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Do not run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry */
  retries: process.env.CI ? 2 : 2,
  /* Opt out of parallel tests. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Tests that take over a minute to run are considered slow */
  reportSlowTests: { max: 10, threshold: 60 * 1000 },
  /* Test timeout of 1 minute */
  timeout: 60000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: env.NEXTAUTH_URL,

    /* Collect trace on failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
  },
  expect: {
    /* Set default timeout on assertions to be 10s */
    timeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup db",
      testMatch: /global\.setup\.ts/,
    },
    {
      name: "setup auth",
      testMatch: /auth\.setup\.ts/,
      dependencies: ["setup db"],
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup auth"],
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    //   dependencies: ["setup auth"],
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] }
    // },

    /* Test against mobile viewports. */
    // {
    //   name: "Mobile Chrome",
    //   use: { ...devices["Pixel 5"] },
    //   dependencies: ["setup auth"],
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: "Google Chrome",
    //   use: { ...devices["Desktop Chrome"], channel: "chrome" },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm run build && pnpm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
