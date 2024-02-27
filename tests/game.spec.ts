import { env } from "@/src/env";
import test, { type Page, type BrowserContext, expect } from "@playwright/test";

let page: Page
let context: BrowserContext

test("select initial starters", async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto(env.NEXTAUTH_URL);
  await context.addCookies([
    {
      name: env.TEST_NAME,
      value: env.TEST_VALUE2,
      url: env.NEXTAUTH_URL
    }
  ]);
  await page.reload();
  await expect(page.getByText(env.TEST_UNAME2)).toBeVisible();

  /*
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
*/

  await context.close()
  await page.close()

});

test("sorting buttons", async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto(env.NEXTAUTH_URL);
  await context.addCookies([
    {
      name: env.TEST_NAME,
      value: env.TEST_VALUE1,
      url: env.NEXTAUTH_URL
    }
  ]);
  await page.reload();
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  await expect(page.getByText("You have 46 / 2,000 Pokémon.")).toBeVisible();

  await context.close()
  await page.close()

})
