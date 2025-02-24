/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect } from "@playwright/test";
import { TradesPage } from "./models/trades";
import { GamePage } from "./models/game";

type Fixtures = {
  redTradesPage: TradesPage;
  blueTradesPage: TradesPage;
  redGamePage: GamePage;
  blueGamePage: GamePage;
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

  redGamePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "./playwright/.auth/red.json",
    });
    await use(new GamePage(await context.newPage()));
  },

  blueGamePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "./playwright/.auth/blue.json",
    });
    await use(new GamePage(await context.newPage()));
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
  await redTradesPage.cancelTrade();
  await expect(redTradesPage.topbar.content).toContainText(
    "You have 2,000 / 2,000",
  );
  await expect(redTradesPage.topbar.content).toContainText(
    "You will receive P100 on the next payout.",
  );
  await redTradesPage.isTradeInitiated(false);
  await expect(redTradesPage.cancelTradeButton).not.toBeVisible();
});

test("withdraw trade", async ({ redTradesPage, blueTradesPage }) => {
  await redTradesPage.goto();
  await redTradesPage.initiateTrade();
  await blueTradesPage.goto();
  await blueTradesPage.offerTrade();
  await blueTradesPage.offererSuccessClose.click();
  await blueTradesPage.withdrawTrade();
  await expect(blueTradesPage.topbar.content).toContainText(
    "You have 1 / 2,000",
  );
  await blueTradesPage.isTradeInitiated(true);
  await expect(blueTradesPage.withdrawTradeButton).not.toBeVisible();
  await expect(blueTradesPage.offerTradeButton).toBeVisible();
  await blueTradesPage.isTradeOffered(false);

  await redTradesPage.page.reload();
  await redTradesPage.isTradeInitiated(true);
  await expect(redTradesPage.offerTradeButton).not.toBeVisible();
  await redTradesPage.isTradeOffered(false);
  await expect(redTradesPage.withdrawTradeButton).not.toBeVisible();
  await expect(redTradesPage.cancelTradeButton).toBeVisible();
  await expect(redTradesPage.offerTradeButton).not.toBeVisible();

  // Cleanup
  await redTradesPage.cancelTrade();
});

test("decline trade", async ({ redTradesPage, blueTradesPage }) => {
  await redTradesPage.goto();
  await redTradesPage.initiateTrade();
  await blueTradesPage.goto();
  await blueTradesPage.offerTrade();

  await redTradesPage.page.reload();
  await redTradesPage.declineTrade();
  await redTradesPage.isTradeInitiated(true);
  await expect(redTradesPage.cancelTradeButton).toBeVisible();
  await expect(redTradesPage.offerTradeButton).not.toBeVisible();
  await redTradesPage.isTradeOffered(false);
  await expect(redTradesPage.withdrawTradeButton).not.toBeVisible();

  await blueTradesPage.page.reload();
  await blueTradesPage.isTradeInitiated(true);
  await expect(blueTradesPage.cancelTradeButton).not.toBeVisible();
  await expect(blueTradesPage.offerTradeButton).toBeVisible();
  await blueTradesPage.isTradeOffered(false);
  await expect(blueTradesPage.withdrawTradeButton).not.toBeVisible();

  // Cleanup
  await redTradesPage.cancelTrade();
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
    await redTradesPage.isTradeInitiated(false);
    await expect(redTradesPage.cancelTradeButton).not.toBeVisible();
    await redTradesPage.initiateTrade();
    await expect(redTradesPage.initiatorSuccessMessage).toBeVisible();
    await expect(redTradesPage.topbar.content).toContainText(
      "You have 2,000 / 2,000",
    );
    await expect(redTradesPage.topbar.content).toContainText(
      "You will receive P100 on the next payout.",
    );
    await redTradesPage.isTradeInitiated(true);
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
    await blueTradesPage.isTradeInitiated(true);
    await expect(blueTradesPage.cancelTradeButton).not.toBeVisible();
    await expect(blueTradesPage.offerTradeButton).toBeVisible();
    await expect(blueTradesPage.offererSuccessMessage).not.toBeVisible();
    await blueTradesPage.isTradeOffered(false);
    await expect(blueTradesPage.withdrawTradeButton).not.toBeVisible();
    await blueTradesPage.offerTrade();
    await expect(blueTradesPage.offererSuccessMessage).toBeVisible();
    await expect(blueTradesPage.topbar.content).toContainText(
      "You have 1 / 2,000",
    );
    await expect(blueTradesPage.topbar.content).toContainText(
      "You will receive P100 on the next payout.",
    );
    await blueTradesPage.isTradeOffered(true);
    await expect(blueTradesPage.withdrawTradeButton).toBeVisible();
    await expect(blueTradesPage.offerTradeButton).not.toBeVisible();
  });

  test("accept trade", async ({
    redTradesPage,
    blueTradesPage,
    redGamePage,
    blueGamePage,
  }) => {
    await redTradesPage.goto();
    await redTradesPage.acceptTrade();
    await redTradesPage.isTradeInitiated(false);
    await redTradesPage.isTradeOffered(false);
    await expect(redTradesPage.topbar.content).toContainText(
      "You have 2,000 / 2,000",
    );
    await expect(redTradesPage.topbar.content).toContainText(
      "You will receive P100 on the next payout.",
    );

    await redGamePage.goto();
    await expect(redGamePage.squirtle).toBeVisible();
    await expect(redGamePage.charmander).not.toBeVisible();

    await blueTradesPage.goto();
    await blueTradesPage.isTradeInitiated(false);
    await blueTradesPage.isTradeOffered(false);
    await expect(blueTradesPage.topbar.content).toContainText(
      "You have 1 / 2,000",
    );
    await expect(blueTradesPage.topbar.content).toContainText(
      "You will receive P100 on the next payout.",
    );

    await blueGamePage.goto();
    await expect(blueGamePage.charmander).toBeVisible();
    await expect(blueGamePage.squirtle).not.toBeVisible();
  });
});

test.afterEach(
  async ({ redTradesPage, blueTradesPage, redGamePage, blueGamePage }) => {
    await redTradesPage.page.close();
    await blueTradesPage.page.close();
    await redGamePage.page.close();
    await blueGamePage.page.close();
  },
);
