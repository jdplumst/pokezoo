import { test, expect, type Page } from "@playwright/test";

let page: Page;

test.beforeAll("go to home page", async ({ browser }) => {
  page = await browser.newPage();
  await page.goto("");
});

test("has title", async () => {
  await expect(page).toHaveTitle("PokéZoo");
});

test("has login buttons", async () => {
  await expect(page.getByText("Sign In With GitHub")).toBeVisible();
  await expect(page.getByText("Sign In With Twitch")).toBeVisible();
  await expect(page.getByText("Sign In With Google")).toBeVisible();
});
