import { type Locator, type Page } from "@playwright/test";

export class OnboardingPage {
  readonly page: Page;
  readonly title: Locator;
  readonly usernameInput: Locator;
  readonly bulbasaur: Locator;
  readonly charmander: Locator;
  readonly squirtle: Locator;
  readonly beginJourneyButton: Locator;
  readonly errorToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", { name: "Welcome to PokéZoo!" });
    this.usernameInput = page.getByPlaceholder("Enter username");
    this.bulbasaur = page.locator("label").filter({ hasText: "bulbasaur" });
    this.charmander = page.locator("label").filter({ hasText: "charmander" });
    this.squirtle = page.locator("label").filter({ hasText: "squirtle" });
    this.beginJourneyButton = page.getByRole("button", {
      name: "Begin Journey",
    });
    this.errorToast = page.locator("li");
  }

  async goto() {
    await this.page.goto("./onboarding");
  }
}
