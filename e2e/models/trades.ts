import { expect, type Locator, type Page } from "@playwright/test";
import { Topbar } from "./topbar";

export class TradesPage {
  readonly page: Page;
  readonly topbar: Topbar;
  readonly addTradeButton: Locator;
  readonly cancelTradeButton: Locator;
  readonly descriptionInput: Locator;
  readonly descriptionCount: Locator;
  readonly pokemonSearch: Locator;
  readonly charmander: Locator;
  readonly squirtle: Locator;
  readonly initiatorText: Locator;
  readonly initiatorSprite: Locator;
  readonly initiatorPokemon: Locator;
  readonly initiatorDescription: Locator;
  readonly initiateSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topbar = new Topbar(page);
    this.addTradeButton = page.getByRole("button", { name: "Add Trade" });
    this.cancelTradeButton = page.getByRole("button", { name: "Cancel Trade" });
    this.descriptionInput = page.getByPlaceholder(
      "Enter a short message here.",
    );
    this.descriptionCount = page.getByText("/ 100");
    this.pokemonSearch = page.getByPlaceholder("Search a pokémon to trade.");
    this.charmander = page.getByRole("button", {
      name: "charmander charmander",
    });
    this.squirtle = page.getByRole("button", { name: "squirtle squirtle" });
    this.initiatorText = page.getByText("Red wants to trade!");
    this.initiatorSprite = page.getByRole("img", { name: "charmander" });
    this.initiatorPokemon = page.getByText("charmander");
    this.initiatorDescription = page.getByText("Hello world");
    this.initiateSuccessMessage = page
      .getByText("You have successfully added a trade!")
      .first();
  }

  async goto() {
    await this.page.goto("./trades");
  }

  async initiateTrade() {
    await this.addTradeButton.click();
    await expect(this.descriptionCount).toHaveText("0 / 100");
    await this.descriptionInput.fill("Hello world");
    await expect(this.descriptionCount).toHaveText("11 / 100");
    await this.pokemonSearch.fill("charmander");
    await this.charmander.click();
    await this.addTradeButton.scrollIntoViewIfNeeded();
    await this.addTradeButton.click();
  }
}
