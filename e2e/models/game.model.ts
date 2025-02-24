import { type Locator, type Page } from "@playwright/test";

export class GamePage {
  readonly page: Page;
  readonly bulbasaur: Locator;
  readonly charmander: Locator;
  readonly squirtle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bulbasaur = this.page.getByRole("img", { name: "bulbasaur" });
    this.charmander = this.page.getByRole("img", { name: "charmander" });
    this.squirtle = this.page.getByRole("img", { name: "squirtle" });
  }

  async goto() {
    await this.page.goto("/game");
  }
}
