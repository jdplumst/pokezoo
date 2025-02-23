import { expect, type Locator, type Page } from "@playwright/test";
import { Topbar } from "./topbar";

export class TradesPage {
  readonly page: Page;
  readonly topbar: Topbar;
  readonly addTradeButton: Locator;
  readonly cancelTradeButton: Locator;
  readonly offerTradeButton: Locator;
  readonly withdrawTradeButton: Locator;
  readonly declineTradeButton: Locator;
  readonly descriptionInput: Locator;
  readonly descriptionCount: Locator;
  readonly pokemonSearch: Locator;
  readonly charmander: Locator;
  readonly squirtle: Locator;
  readonly initiatorText: Locator;
  readonly initiatorSprite: Locator;
  readonly initiatorPokemon: Locator;
  readonly initiatorDescription: Locator;
  readonly initiatorSuccessMessage: Locator;
  readonly offererText: Locator;
  readonly offererSprite: Locator;
  readonly offererPokemon: Locator;
  readonly offererSuccessMessage: Locator;
  readonly offererSuccessClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topbar = new Topbar(page);
    this.addTradeButton = page.getByRole("button", { name: "Add Trade" });
    this.cancelTradeButton = page.getByRole("button", { name: "Cancel Trade" });
    this.offerTradeButton = page.getByRole("button", { name: "Add Offer" });
    this.withdrawTradeButton = page.getByRole("button", { name: "Withdraw" });
    this.declineTradeButton = page.getByRole("button", { name: "Decline" });
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
    this.initiatorSuccessMessage = page
      .getByText("You have successfully added a trade!")
      .first();
    this.offererText = page.getByText("Blue has an offer!");
    this.offererSprite = page.getByRole("img", { name: "squirtle" });
    this.offererPokemon = page.getByText("squirtle");
    this.offererSuccessMessage = page
      .getByText("You have successfully added an offer to the trade.")
      .first();
    this.offererSuccessClose = page
      .getByLabel("Notifications (F8)")
      .getByRole("button");
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

  async offerTrade() {
    await this.offerTradeButton.click();
    await expect(this.descriptionInput).not.toBeVisible();
    await expect(this.descriptionCount).not.toBeVisible();
    await this.pokemonSearch.fill("squirtle");
    await this.squirtle.click();
    await this.offerTradeButton.scrollIntoViewIfNeeded();
    await this.offerTradeButton.click();
  }
}
