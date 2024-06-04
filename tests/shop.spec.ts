import { env } from "@/src/env";
import test, { expect } from "@playwright/test";
import { login } from "./helpers/login";
import { closePage } from "./helpers/closePage";

test.beforeAll("reset accounts", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto(env.TEST_RESET);
  await expect(
    page.getByText("Test accounts reset successfully"),
  ).toBeVisible();
  await closePage(page, context);
});

test("purchase poke balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Poké-button").click();
    await expect(page.getByText(/Rarity: (Common|Rare)/)).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});

test("purhcase ultra balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Ultra-button").click();
    await expect(page.getByText(/Rarity: (Rare|Epic)/)).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});
