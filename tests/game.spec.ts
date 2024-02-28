import { env } from "@/src/env";
import test, { expect } from "@playwright/test";
import { login } from "./helpers/login";


test.beforeAll("reset accounts", async ({ browser }) => {
  const [page, context] = await login(browser, 1)
  await page.goto(env.TEST_RESET)
  await expect(page.getByText("Test accounts reset successfully")).toBeVisible()
  await context.close()
  await page.close()
})

test("select initial starters", async ({ browser }) => {
  const [page, context] = await login(browser, 2)
  await page.goto(env.NEXTAUTH_URL)
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
  const [page, context] = await login(browser, 1)
  await page.goto(env.NEXTAUTH_URL)
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  await expect(page.getByText("You have 46 / 2,000 Pokémon.")).toBeVisible();

  await context.close()
  await page.close()

})
