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

  await context.close()
  await page.close()

});

test("sorting buttons", async ({ browser }) => {
  const [page, context] = await login(browser, 1)
  await page.goto(env.NEXTAUTH_URL)
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  await expect(page.getByText("You have 46 / 2,000 Pokémon.")).toBeVisible();
  await expect(page.getByText("#").locator("nth=48")).not.toBeVisible()

  // Oldest
  await page.getByTestId("oldest-sort").click()
  await expect(page.getByText("#").locator("nth=2")).toContainText("articuno")
  await expect(page.getByText("#").locator("nth=3")).toContainText("mewtwo")
  await expect(page.getByText("#").locator("nth=4")).toContainText("mega-mewtwo-x")
  await expect(page.getByText("#").locator("nth=17")).toContainText("umbreon")
  await expect(page.getByText("#").locator("nth=21")).toContainText("meowstic-female")
  await expect(page.getByText("#").locator("nth=27")).toContainText("rotom-frost")
  await expect(page.getByText("#").locator("nth=31")).toContainText("victini")
  await expect(page.getByText("#").locator("nth=34")).toContainText("hippowdon-m")
  await expect(page.getByText("#").locator("nth=37")).toContainText("mega-mawile")
  await expect(page.getByText("#").locator("nth=40")).toContainText("rotom-mow")
  await expect(page.getByText("#").locator("nth=44")).toContainText("metagross")
  await expect(page.getByText("#").locator("nth=47")).toContainText("castform-sunny")

  // Pokedex # 
  await page.getByTestId("pokedex-sort").click()
  await expect(page.getByText("#").locator("nth=2")).toContainText("venusaur")
  await expect(page.getByText("#").locator("nth=2")).not.toContainText("mega")
  await expect(page.getByText("#").locator("nth=3")).toContainText("mega-venusaur")
  await expect(page.getByText("#").locator("nth=7")).toContainText("mewtwo")
  await expect(page.getByText("#").locator("nth=7")).not.toContainText("mega")
  await expect(page.getByText("#").locator("nth=8")).toContainText("mega-mewtwo-x")
  await expect(page.getByText("#").locator("nth=9")).toContainText("mega-mewtwo-y")
  await expect(page.getByText("#").locator("nth=22")).toContainText("castform")
  await expect(page.getByText("#").locator("nth=23")).toContainText("castform-rainy")
  await expect(page.getByText("#").locator("nth=24")).toContainText("castform-snowy")
  await expect(page.getByText("#").locator("nth=25")).toContainText("castform-sunny")
  await expect(page.getByText("#").locator("nth=28")).toContainText("kyogre")
  await expect(page.getByText("#").locator("nth=28")).not.toContainText("primal")
  await expect(page.getByText("#").locator("nth=29")).toContainText("primal-kyogre")
  await expect(page.getByText("#").locator("nth=34")).toContainText("rotom")
  await expect(page.getByText("#").locator("nth=35")).toContainText("rotom-fan")
  await expect(page.getByText("#").locator("nth=36")).toContainText("rotom-frost")
  await expect(page.getByText("#").locator("nth=37")).toContainText("rotom-heat")
  await expect(page.getByText("#").locator("nth=38")).toContainText("rotom-mow")
  await expect(page.getByText("#").locator("nth=39")).toContainText("rotom-wash")
  await expect(page.getByText("#").locator("nth=46")).toContainText("meowstic-female")
  await expect(page.getByText("#").locator("nth=47")).toContainText("meowstic-male")

  // Pokedex # Desc
  await page.getByTestId("pokedex-desc-sort").click()
  await expect(page.getByText("#").locator("nth=2")).toContainText("meowstic-male")
  await expect(page.getByText("#").locator("nth=3")).toContainText("meowstic-female")
  await expect(page.getByText("#").locator("nth=10")).toContainText("rotom-wash")
  await expect(page.getByText("#").locator("nth=11")).toContainText("rotom-mow")
  await expect(page.getByText("#").locator("nth=12")).toContainText("rotom-heat")
  await expect(page.getByText("#").locator("nth=13")).toContainText("rotom-frost")
  await expect(page.getByText("#").locator("nth=14")).toContainText("rotom-fan")
  await expect(page.getByText("#").locator("nth=15")).toContainText("rotom")
  await expect(page.getByText("#").locator("nth=20")).toContainText("primal-kyogre")
  await expect(page.getByText("#").locator("nth=21")).toContainText("kyogre")
  await expect(page.getByText("#").locator("nth=21")).not.toContainText("primal")
  await expect(page.getByText("#").locator("nth=24")).toContainText("castform-sunny")
  await expect(page.getByText("#").locator("nth=25")).toContainText("castform-snowy")
  await expect(page.getByText("#").locator("nth=26")).toContainText("castform-rainy")
  await expect(page.getByText("#").locator("nth=27")).toContainText("castform")
  await expect(page.getByText("#").locator("nth=40")).toContainText("mega-mewtwo-y")
  await expect(page.getByText("#").locator("nth=41")).toContainText("mega-mewtwo-x")
  await expect(page.getByText("#").locator("nth=42")).toContainText("mewtwo")
  await expect(page.getByText("#").locator("nth=42")).not.toContainText("mega")
  await expect(page.getByText("#").locator("nth=46")).toContainText("mega-venusaur")
  await expect(page.getByText("#").locator("nth=47")).toContainText("venusaur")
  await expect(page.getByText("#").locator("nth=47")).not.toContainText("mega")

  // Rarity
  await page.getByTestId("rarity-sort").click()
  await expect(page.getByText("#").locator("nth=2")).toContainText("caterpie")
  await expect(page.getByText("#").locator("nth=6")).toContainText("castform")
  await expect(page.getByText("#").locator("nth=7")).toContainText("castform-rainy")
  await expect(page.getByText("#").locator("nth=8")).toContainText("castform-snowy")
  await expect(page.getByText("#").locator("nth=9")).toContainText("castform-sunny")
  await expect(page.getByText("#").locator("nth=22")).toContainText("meowstic-male")
  await expect(page.getByText("#").locator("nth=23")).toContainText("venusaur")
  await expect(page.getByText("#").locator("nth=28")).toContainText("greninja")
  await expect(page.getByText("#").locator("nth=29")).toContainText("growlithe")
  await expect(page.getByText("#").locator("nth=34")).toContainText("hippowdon-m")
  await expect(page.getByText("#").locator("nth=35")).toContainText("articuno")
  await expect(page.getByText("#").locator("nth=41")).toContainText("ash-greninja")
  await expect(page.getByText("#").locator("nth=42")).toContainText("mega-venusaur")
  await expect(page.getByText("#").locator("nth=47")).toContainText("primal-kyogre")

  // Rarity Desc
  await page.getByTestId("rarity-desc-sort").click()
  await expect(page.getByText("#").locator("nth=2")).toContainText("primal-kyogre")
  await expect(page.getByText("#").locator("nth=3")).toContainText("mega-mawile")
  await expect(page.getByText("#").locator("nth=7")).toContainText("mega-venusaur")
  await expect(page.getByText("#").locator("nth=8")).toContainText("ash-greninja")
  await expect(page.getByText("#").locator("nth=14")).toContainText("articuno")
  await expect(page.getByText("#").locator("nth=15")).toContainText("hippowdon-m")
  await expect(page.getByText("#").locator("nth=20")).toContainText("growlithe")
  await expect(page.getByText("#").locator("nth=21")).toContainText("greninja")
  await expect(page.getByText("#").locator("nth=26")).toContainText("venusaur")
  await expect(page.getByText("#").locator("nth=27")).toContainText("meowstic-male")
  await expect(page.getByText("#").locator("nth=47")).toContainText("caterpie")

  await context.close()
  await page.close()

})
