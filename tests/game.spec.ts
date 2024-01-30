import { env } from "@/src/env";
import test, { Page, expect } from "@playwright/test";

let page: Page;

test.beforeAll("login", async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto(env.NEXTAUTH_URL);
  await context.addCookies([
    {
      name: env.TEST_NAME,
      value: env.TEST_VALUE,
      url: env.NEXTAUTH_URL
    }
  ]);
  await page.reload();
  await expect(page.getByText(env.TEST_UNAME)).toBeVisible();
});

test("test", async () => {
  await expect(page.getByText(env.TEST_UNAME)).toBeVisible();
});
