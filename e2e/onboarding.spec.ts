import test from "@playwright/test";

test.use({ storageState: "./playwright/.auth/green.json" });

test("complete onboarding", async ({ page }) => {
  await page.goto("./onboarding");
});
