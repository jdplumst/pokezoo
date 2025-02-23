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

test("cancel trade", async ({ redTradesPage }) => {
  await redTradesPage.goto();
  await expect(redTradesPage.topbar.content).toContainText(
    "You have 2,000 / 2,000",
  );
  await expect(redTradesPage.topbar.content).toContainText(
    "You will receive P100 on the next payout.",
  );
  await redTradesPage.initiateTrade();
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

test("withdraw trade", async ({ redTradesPage, blueTradesPage }) => {
  await redTradesPage.goto();
  await redTradesPage.initiateTrade();
  await blueTradesPage.goto();
  await blueTradesPage.page.reload();
  await blueTradesPage.offerTrade();
  await blueTradesPage.offererSuccessClose.click();
  // await blueTradesPage.page.reload();
  await blueTradesPage.withdrawTradeButton.click();
  await expect(blueTradesPage.topbar.content).toContainText(
    "You have 1 / 2,000",
  );
  await expect(blueTradesPage.initiatorText).toBeVisible();
  await expect(blueTradesPage.initiatorSprite).toBeVisible();
  await expect(blueTradesPage.initiatorPokemon).toBeVisible();
  await expect(blueTradesPage.initiatorDescription).toBeVisible();
  await expect(blueTradesPage.withdrawTradeButton).not.toBeVisible();
  await expect(blueTradesPage.offerTradeButton).toBeVisible();
  await expect(blueTradesPage.offererText).not.toBeVisible();
  await expect(blueTradesPage.offererSprite).not.toBeVisible();
  await expect(blueTradesPage.offererPokemon).not.toBeVisible();

  await redTradesPage.page.reload();
  await expect(redTradesPage.initiatorText).toBeVisible();
  await expect(redTradesPage.initiatorSprite).toBeVisible();
  await expect(redTradesPage.initiatorPokemon).toBeVisible();
  await expect(redTradesPage.initiatorDescription).toBeVisible();
  await expect(redTradesPage.offerTradeButton).not.toBeVisible();
  await expect(redTradesPage.offererText).not.toBeVisible();
  await expect(redTradesPage.offererSprite).not.toBeVisible();
  await expect(redTradesPage.offererPokemon).not.toBeVisible();
  await expect(redTradesPage.withdrawTradeButton).not.toBeVisible();
  await expect(redTradesPage.cancelTradeButton).toBeVisible();
  await expect(redTradesPage.offerTradeButton).not.toBeVisible();
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
    await expect(redTradesPage.initiatorSuccessMessage).not.toBeVisible();
    await expect(redTradesPage.initiatorText).not.toBeVisible();
    await expect(redTradesPage.initiatorSprite).not.toBeVisible();
    await expect(redTradesPage.initiatorPokemon).not.toBeVisible();
    await expect(redTradesPage.initiatorDescription).not.toBeVisible();
    await expect(redTradesPage.cancelTradeButton).not.toBeVisible();
    await redTradesPage.initiateTrade();
    await expect(redTradesPage.initiatorSuccessMessage).toBeVisible();
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
    await expect(redTradesPage.offerTradeButton).not.toBeVisible();
  });

  test("add offer", async ({ blueTradesPage }) => {
    await blueTradesPage.goto();
    await expect(blueTradesPage.topbar.content).toContainText(
      "You have 1 / 2,000",
    );
    await expect(blueTradesPage.topbar.content).toContainText(
      "You will receive P100 on the next payout.",
    );
    await expect(blueTradesPage.initiatorText).toBeVisible();
    await expect(blueTradesPage.initiatorSprite).toBeVisible();
    await expect(blueTradesPage.initiatorPokemon).toBeVisible();
    await expect(blueTradesPage.initiatorDescription).toBeVisible();
    await expect(blueTradesPage.cancelTradeButton).not.toBeVisible();
    await expect(blueTradesPage.offerTradeButton).toBeVisible();
    await expect(blueTradesPage.offererSuccessMessage).not.toBeVisible();
    await expect(blueTradesPage.offererText).not.toBeVisible();
    await expect(blueTradesPage.offererSprite).not.toBeVisible();
    await expect(blueTradesPage.offererPokemon).not.toBeVisible();
    await expect(blueTradesPage.withdrawTradeButton).not.toBeVisible();
    await blueTradesPage.offerTrade();
    await expect(blueTradesPage.offererSuccessMessage).toBeVisible();
    await expect(blueTradesPage.topbar.content).toContainText(
      "You have 1 / 2,000",
    );
    await expect(blueTradesPage.topbar.content).toContainText(
      "You will receive P100 on the next payout.",
    );
    await expect(blueTradesPage.offererText).toBeVisible();
    await expect(blueTradesPage.offererSprite).toBeVisible();
    await expect(blueTradesPage.offererPokemon).toBeVisible();
    await expect(blueTradesPage.withdrawTradeButton).toBeVisible();
    await expect(blueTradesPage.offerTradeButton).not.toBeVisible();
  });
});

// test.afterEach(async ({ redTradesPage, blueTradesPage }) => {
//   await redTradesPage.page.close();
//   await blueTradesPage.page.close();
// });
