import { env } from "~/env";
import { type Page, type Browser, type BrowserContext } from "@playwright/test";

export async function login(
  browser: Browser,
  account: number,
): Promise<[Page, BrowserContext]> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/");

  switch (account) {
    case 1:
      await context.addCookies([
        {
          name: env.TEST_NAME,
          value: env.TEST_VALUE1,
          url: env.NEXTAUTH_URL,
        },
      ]);
      break;
    case 2:
      await context.addCookies([
        {
          name: env.TEST_NAME,
          value: env.TEST_VALUE2,
          url: env.NEXTAUTH_URL,
        },
      ]);
      break;
  }
  await page.reload();

  return [page, context];
}
