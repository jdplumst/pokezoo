import { env } from "@/src/env";
import test, { type Page, type BrowserContext, expect } from "@playwright/test";

let page: Page
let context: BrowserContext

test.beforeAll("login", async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto(env.NEXTAUTH_URL);
  await context.addCookies([
    {
      name: env.TEST_NAME,
      value: env.TEST_VALUE,
      url: env.NEXTAUTH_URL
    }
  ]);
  await page.reload();
  await expect(page.getByText(env.TEST_UNAME)).toBeVisible();

  if ((await page.getByText("Sell Pokémon").count()) > 0) {
    for (const btn of await page.getByText("Sell Pokémon").all()) {
      await btn.click();
    }

    await page.getByText("Confirm Delete").click();
  }
  await expect(page.getByText("You have 0 / 2,000 Pokémon.")).toBeVisible();
});

test("select initial starters", async () => {
  // Select Bulbasaur
  await page.getByText("Bulbasaur").click();
  await page.getByText("Confirm Selection").click();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Bulbasaur")).toBeVisible();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.getByText("Sell Pokémon").click()
  await page.getByText("Confirm Delete").click()
  await expect(page.getByText("You have 0 / 2,000 Pokémon.")).toBeVisible();

  // Select Charmander
  await page.getByText("Charmander").click();
  await page.getByText("Confirm Selection").click();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Charmander")).toBeVisible();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.getByText("Sell Pokémon").click()
  await page.getByText("Confirm Delete").click()
  await expect(page.getByText("You have 0 / 2,000 Pokémon.")).toBeVisible();

  // Select Squirtle
  await page.getByText("Squirtle").click();
  await page.getByText("Confirm Selection").click();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Squirtle")).toBeVisible();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.getByText("Sell Pokémon").click()
  await page.getByText("Confirm Delete").click()
  await expect(page.getByText("You have 0 / 2,000 Pokémon.")).toBeVisible();

});

test.afterAll("close context and page", async () => {
  await context.close()
  await page.close()
})
