import { BrowserContext, Page } from "@playwright/test";

export async function closePage(page: Page, context: BrowserContext) {
  await context.close();
  await page.close();
}
