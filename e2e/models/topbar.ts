import { type Locator, type Page } from "@playwright/test";

export class Topbar {
  readonly page: Page;
  readonly content: Locator;

  constructor(page: Page) {
    this.page = page;
    this.content = page
      .locator("div")
      .filter({ hasText: "Your current balance is" })
      .nth(2);
  }
}
