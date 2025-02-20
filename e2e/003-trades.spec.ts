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

test.describe("end to end trades", () => {
  test("initiate trade", async ({ redTradesPage }) => {
    await redTradesPage.goto();
    await expect(redTradesPage.topbar.content).toContainText(
      "You have 2,000 / 2,000",
    );
    await expect(redTradesPage.topbar.content).toContainText(
      "You will receive P100 on the next payout.",
    );
    await expect(redTradesPage.initiateSuccessMessage).not.toBeVisible();
    await expect(redTradesPage.initiatorText).not.toBeVisible();
    await expect(redTradesPage.initiatorSprite).not.toBeVisible();
    await expect(redTradesPage.initiatorPokemon).not.toBeVisible();
    await expect(redTradesPage.initiatorDescription).not.toBeVisible();
    await expect(redTradesPage.cancelTradeButton).not.toBeVisible();
    await redTradesPage.initiateTrade();
    await expect(redTradesPage.initiateSuccessMessage).toBeVisible();
    await expect(redTradesPage.topbar.content).toContainText(
      "You have 2,000 / 2,000",
    );
    await expect(redTradesPage.topbar.content).toContainText(
      "You will receive P100 on the next payout.",
    );
    await expect(redTradesPage.initiatorText).toBeVisible();
    await expect(redTradesPage.initiatorSprite).toBeVisible();
    await expect(redTradesPage.initiatorPokemon).toBeVisible();
    await expect(redTradesPage.initiatorDescription).toBeVisible();
    await expect(redTradesPage.cancelTradeButton).toBeVisible();
  });
});

test("cancel trade", async ({ redTradesPage }) => {
  await redTradesPage.goto();
  await expect(redTradesPage.topbar.content).toContainText(
    "You have 2,000 / 2,000",
  );
  await expect(redTradesPage.topbar.content).toContainText(
    "You will receive P100 on the next payout.",
  );
  // TODO: uncomment this when full trade flow is implemented or when testing in isolation
  // await redTradesPage.initiateTrade();
  await redTradesPage.cancelTradeButton.click();
  await expect(redTradesPage.topbar.content).toContainText(
    "You have 2,000 / 2,000",
  );
  await expect(redTradesPage.topbar.content).toContainText(
    "You will receive P100 on the next payout.",
  );
  await expect(redTradesPage.initiatorText).not.toBeVisible();
  await expect(redTradesPage.initiatorSprite).not.toBeVisible();
  await expect(redTradesPage.initiatorPokemon).not.toBeVisible();
  await expect(redTradesPage.initiatorDescription).not.toBeVisible();
  await expect(redTradesPage.cancelTradeButton).not.toBeVisible();
});

// test.afterEach(async ({ redTradesPage, blueTradesPage }) => {
//   await redTradesPage.page.close();
//   await blueTradesPage.page.close();
// });
