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

test("purchase great balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Great-button").click();
    await expect(page.getByText(/Rarity: (Common|Rare|Epic)/)).toBeVisible();
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

test("purchase master balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Master-button").click();
    await expect(page.getByText(/Rarity: (Epic|Legendary)/)).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});

test("purchase net balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Net-button").click();
    await expect(page.getByText(/(Water|Bug)/).first()).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});

test("purchase dusk balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Dusk-button").click();
    await expect(page.getByText(/(Ghost|Dark)/).first()).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});

test("purchase dive balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Dive-button").click();
    await expect(page.getByText(/Habitat: (Waters-Edge|Sea)/)).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});

test("purchase safari balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Safari-button").click();
    await expect(
      page.getByText(/Habitat: (Mountain|Rough-Terrain)/),
    ).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});

test("purchase luxury balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Luxury-button").click();
    await expect(page.getByText(/Rarity: (Epic|Legendary)/)).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});

test("purchase cherish balls", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto("/shop");
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  // Purchase 10 times
  for (let i = 0; i < 10; i++) {
    await page.getByTestId("Cherish-button").click();
    await expect(page.getByText(/Rarity: (Legendary|Mega)/)).toBeVisible();
    await page.getByTestId("confirm-ball-button").click();
  }

  await closePage(page, context);
});
