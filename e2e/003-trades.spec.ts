/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect } from "@playwright/test";
import { TradesPage } from "./models/trades";

type Fixtures = {
  redTradesPage: TradesPage;
  blueTradesPage: TradesPage;
};

export const test = base.extend<Fixtures>({
  redTradesPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "./playwright/.auth/red.json",
    });
    const page = await context.newPage();
    await use(new TradesPage(page));
  },

  blueTradesPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "./playwright/.auth/blue.json",
    });
    await use(new TradesPage(await context.newPage()));
  },
});

test("initiate trade", async ({ redTradesPage }) => {
  await redTradesPage.goto();
  await expect(redTradesPage.topbar.content).toContainText(
    "You have 2,000 / 2,000",
  );
  await expect(redTradesPage.topbar.content).toContainText(
    "You will receive P100 on the next payout.",
  );
  await redTradesPage.addTradeButton.click();
  await expect(redTradesPage.descriptionCount).toHaveText("0 / 100");
  await redTradesPage.descriptionInput.fill("Hello world");
  await expect(redTradesPage.descriptionCount).toHaveText("11 / 100");
  await redTradesPage.pokemonSearch.fill("charmander");
  await redTradesPage.charmander.click();
  await redTradesPage.addTradeButton.scrollIntoViewIfNeeded();
  await redTradesPage.addTradeButton.click();
  await expect(redTradesPage.topbar.content).toContainText(
    "You have 2,000 / 2,000",
  );
  await expect(redTradesPage.topbar.content).toContainText(
    "You will receive P100 on the next payout.",
  );
});

test.afterEach(async ({ redTradesPage, blueTradesPage }) => {
  await redTradesPage.page.close();
  await blueTradesPage.page.close();
});
