import { type Locator, type Page } from "@playwright/test";

export class GamePage {
  readonly page: Page;
  readonly grid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.grid = page.getByRole("grid");
  }
}
