import { type Locator, type Page } from "@playwright/test";
import { Topbar } from "./topbar";

export class TradesPage {
  readonly page: Page;
  readonly topbar: Topbar;
  readonly addTradeButton: Locator;
  readonly descriptionInput: Locator;
  readonly descriptionCount: Locator;
  readonly pokemonSearch: Locator;
  readonly charmander: Locator;
  readonly squirtle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topbar = new Topbar(page);
    this.addTradeButton = page.getByRole("button", { name: "Add Trade" });
    this.descriptionInput = page.getByPlaceholder(
      "Enter a short message here.",
    );
    this.descriptionCount = page.getByText("/ 100");
    this.pokemonSearch = page.getByPlaceholder("Search a pokémon to trade.");
    this.charmander = page.getByRole("button", {
      name: "charmander charmander",
    });
    this.squirtle = page.getByRole("button", { name: "squirtle squirtle" });
  }

  async goto() {
    await this.page.goto("./trades");
  }
}
