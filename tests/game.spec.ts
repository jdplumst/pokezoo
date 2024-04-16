import { env } from "@/src/env";
import test, { expect } from "@playwright/test";
import { login } from "./helpers/login";

test.beforeAll("reset accounts", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto(env.TEST_RESET);
  await expect(
    page.getByText("Test accounts reset successfully"),
  ).toBeVisible();
  await context.close();
  await page.close();
});

test("select initial starters", async ({ browser }) => {
  const [page, context] = await login(browser, 2);
  await page.goto(env.NEXTAUTH_URL);
  await expect(page.getByText(env.TEST_UNAME2)).toBeVisible();

  // Select Bulbasaur
  await page.getByText("Bulbasaur").click();
  await page.getByText("Confirm Selection").click();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Bulbasaur")).toBeVisible();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.getByText("Sell Pokémon").click();
  await page.getByText("Confirm Delete").click();
  await expect(page.getByText("You have 0 / 2,000 Pokémon.")).toBeVisible();

  // Select Charmander
  await page.getByText("Charmander").click();
  await page.getByText("Confirm Selection").click();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Charmander")).toBeVisible();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.getByText("Sell Pokémon").click();
  await page.getByText("Confirm Delete").click();
  await expect(page.getByText("You have 0 / 2,000 Pokémon.")).toBeVisible();

  // Select Squirtle
  await page.getByText("Squirtle").click();
  await page.getByText("Confirm Selection").click();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Squirtle")).toBeVisible();
  await expect(page.getByText("You have 1 / 2,000 Pokémon.")).toBeVisible();
  await page.getByText("Sell Pokémon").click();
  await page.getByText("Confirm Delete").click();
  await expect(page.getByText("You have 0 / 2,000 Pokémon.")).toBeVisible();

  await context.close();
  await page.close();
});

test("sorting buttons", async ({ browser }) => {
  const [page, context] = await login(browser, 1);
  await page.goto(env.NEXTAUTH_URL);
  await expect(page.getByText(env.TEST_UNAME1)).toBeVisible();

  await expect(page.getByText("You have 46 / 2,000 Pokémon.")).toBeVisible();
  await expect(page.getByText("#").locator("nth=48")).not.toBeVisible();

  // Oldest
  await page.getByTestId("oldest-sort").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("articuno");
  await expect(page.getByText("#").locator("nth=3")).toContainText("mewtwo");
  await expect(page.getByText("#").locator("nth=4")).toContainText(
    "mega-mewtwo-x",
  );
  await expect(page.getByText("#").locator("nth=17")).toContainText("umbreon");
  await expect(page.getByText("#").locator("nth=21")).toContainText(
    "meowstic-female",
  );
  await expect(page.getByText("#").locator("nth=27")).toContainText(
    "rotom-frost",
  );
  await expect(page.getByText("#").locator("nth=31")).toContainText("victini");
  await expect(page.getByText("#").locator("nth=34")).toContainText(
    "hippowdon-m",
  );
  await expect(page.getByText("#").locator("nth=37")).toContainText(
    "mega-mawile",
  );
  await expect(page.getByText("#").locator("nth=40")).toContainText(
    "rotom-mow",
  );
  await expect(page.getByText("#").locator("nth=44")).toContainText(
    "metagross",
  );
  await expect(page.getByText("#").locator("nth=47")).toContainText(
    "castform-sunny",
  );

  // Newest
  await page.getByTestId("newest-sort").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText(
    "castform-sunny",
  );
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "castform-snowy",
  );
  await expect(page.getByText("#").locator("nth=4")).toContainText(
    "castform-rainy",
  );
  await expect(page.getByText("#").locator("nth=17")).toContainText("ducklett");
  await expect(page.getByText("#").locator("nth=21")).toContainText("furret");
  await expect(page.getByText("#").locator("nth=27")).toContainText(
    "growlithe",
  );
  await expect(page.getByText("#").locator("nth=31")).toContainText("raikou");
  await expect(page.getByText("#").locator("nth=34")).toContainText("caterpie");
  await expect(page.getByText("#").locator("nth=37")).toContainText("greninja");
  await expect(page.getByText("#").locator("nth=40")).toContainText("kyogre");
  await expect(page.getByText("#").locator("nth=44")).toContainText("togepi");
  await expect(page.getByText("#").locator("nth=47")).toContainText("articuno");

  // Pokedex #
  await page.getByTestId("pokedex-sort").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("venusaur");
  await expect(page.getByText("#").locator("nth=2")).not.toContainText("mega");
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "mega-venusaur",
  );
  await expect(page.getByText("#").locator("nth=7")).toContainText("mewtwo");
  await expect(page.getByText("#").locator("nth=7")).not.toContainText("mega");
  await expect(page.getByText("#").locator("nth=8")).toContainText(
    "mega-mewtwo-x",
  );
  await expect(page.getByText("#").locator("nth=9")).toContainText(
    "mega-mewtwo-y",
  );
  await expect(page.getByText("#").locator("nth=22")).toContainText("castform");
  await expect(page.getByText("#").locator("nth=23")).toContainText(
    "castform-rainy",
  );
  await expect(page.getByText("#").locator("nth=24")).toContainText(
    "castform-snowy",
  );
  await expect(page.getByText("#").locator("nth=25")).toContainText(
    "castform-sunny",
  );
  await expect(page.getByText("#").locator("nth=28")).toContainText("kyogre");
  await expect(page.getByText("#").locator("nth=28")).not.toContainText(
    "primal",
  );
  await expect(page.getByText("#").locator("nth=29")).toContainText(
    "primal-kyogre",
  );
  await expect(page.getByText("#").locator("nth=34")).toContainText("rotom");
  await expect(page.getByText("#").locator("nth=35")).toContainText(
    "rotom-fan",
  );
  await expect(page.getByText("#").locator("nth=36")).toContainText(
    "rotom-frost",
  );
  await expect(page.getByText("#").locator("nth=37")).toContainText(
    "rotom-heat",
  );
  await expect(page.getByText("#").locator("nth=38")).toContainText(
    "rotom-mow",
  );
  await expect(page.getByText("#").locator("nth=39")).toContainText(
    "rotom-wash",
  );
  await expect(page.getByText("#").locator("nth=46")).toContainText(
    "meowstic-female",
  );
  await expect(page.getByText("#").locator("nth=47")).toContainText(
    "meowstic-male",
  );

  // Pokedex # Desc
  await page.getByTestId("pokedex-desc-sort").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText(
    "meowstic-male",
  );
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "meowstic-female",
  );
  await expect(page.getByText("#").locator("nth=10")).toContainText(
    "rotom-wash",
  );
  await expect(page.getByText("#").locator("nth=11")).toContainText(
    "rotom-mow",
  );
  await expect(page.getByText("#").locator("nth=12")).toContainText(
    "rotom-heat",
  );
  await expect(page.getByText("#").locator("nth=13")).toContainText(
    "rotom-frost",
  );
  await expect(page.getByText("#").locator("nth=14")).toContainText(
    "rotom-fan",
  );
  await expect(page.getByText("#").locator("nth=15")).toContainText("rotom");
  await expect(page.getByText("#").locator("nth=20")).toContainText(
    "primal-kyogre",
  );
  await expect(page.getByText("#").locator("nth=21")).toContainText("kyogre");
  await expect(page.getByText("#").locator("nth=21")).not.toContainText(
    "primal",
  );
  await expect(page.getByText("#").locator("nth=24")).toContainText(
    "castform-sunny",
  );
  await expect(page.getByText("#").locator("nth=25")).toContainText(
    "castform-snowy",
  );
  await expect(page.getByText("#").locator("nth=26")).toContainText(
    "castform-rainy",
  );
  await expect(page.getByText("#").locator("nth=27")).toContainText("castform");
  await expect(page.getByText("#").locator("nth=40")).toContainText(
    "mega-mewtwo-y",
  );
  await expect(page.getByText("#").locator("nth=41")).toContainText(
    "mega-mewtwo-x",
  );
  await expect(page.getByText("#").locator("nth=42")).toContainText("mewtwo");
  await expect(page.getByText("#").locator("nth=42")).not.toContainText("mega");
  await expect(page.getByText("#").locator("nth=46")).toContainText(
    "mega-venusaur",
  );
  await expect(page.getByText("#").locator("nth=47")).toContainText("venusaur");
  await expect(page.getByText("#").locator("nth=47")).not.toContainText("mega");

  // Rarity
  await page.getByTestId("rarity-sort").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("caterpie");
  await expect(page.getByText("#").locator("nth=6")).toContainText("castform");
  await expect(page.getByText("#").locator("nth=7")).toContainText(
    "castform-rainy",
  );
  await expect(page.getByText("#").locator("nth=8")).toContainText(
    "castform-snowy",
  );
  await expect(page.getByText("#").locator("nth=9")).toContainText(
    "castform-sunny",
  );
  await expect(page.getByText("#").locator("nth=22")).toContainText(
    "meowstic-male",
  );
  await expect(page.getByText("#").locator("nth=23")).toContainText("venusaur");
  await expect(page.getByText("#").locator("nth=28")).toContainText("greninja");
  await expect(page.getByText("#").locator("nth=29")).toContainText(
    "growlithe",
  );
  await expect(page.getByText("#").locator("nth=34")).toContainText(
    "hippowdon-m",
  );
  await expect(page.getByText("#").locator("nth=35")).toContainText("articuno");
  await expect(page.getByText("#").locator("nth=41")).toContainText(
    "ash-greninja",
  );
  await expect(page.getByText("#").locator("nth=42")).toContainText(
    "mega-venusaur",
  );
  await expect(page.getByText("#").locator("nth=47")).toContainText(
    "primal-kyogre",
  );

  // Rarity Desc
  await page.getByTestId("rarity-desc-sort").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText(
    "primal-kyogre",
  );
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "mega-mawile",
  );
  await expect(page.getByText("#").locator("nth=7")).toContainText(
    "mega-venusaur",
  );
  await expect(page.getByText("#").locator("nth=8")).toContainText(
    "ash-greninja",
  );
  await expect(page.getByText("#").locator("nth=14")).toContainText("articuno");
  await expect(page.getByText("#").locator("nth=15")).toContainText(
    "hippowdon-m",
  );
  await expect(page.getByText("#").locator("nth=20")).toContainText(
    "growlithe",
  );
  await expect(page.getByText("#").locator("nth=21")).toContainText("greninja");
  await expect(page.getByText("#").locator("nth=26")).toContainText("venusaur");
  await expect(page.getByText("#").locator("nth=27")).toContainText(
    "meowstic-male",
  );
  await expect(page.getByText("#").locator("nth=47")).toContainText("caterpie");

  await context.close();
  await page.close();
});

test("region filters", async ({ browser }) => {
  const [page, context] = await login(browser, 1);

  // Sort By Pokedex # For Simplicity
  await page.getByTestId("pokedex-sort").click();

  // Kanto Filter
  await expect(page.getByTestId("region-kanto-filter")).not.toBeVisible();
  await page.getByTestId("region-filter").click();
  await expect(page.getByTestId("region-kanto-filter")).toBeVisible();
  await page.getByTestId("region-all-filter").click();
  await expect(page.getByText("#").locator("nth=2")).not.toBeVisible();
  await page.getByTestId("region-kanto-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("venusaur");
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "mega-venusaur",
  );
  await expect(page.getByText("#").locator("nth=4")).toContainText("caterpie");
  await expect(page.getByText("#").locator("nth=5")).toContainText("growlithe");
  await expect(page.getByText("#").locator("nth=6")).toContainText("articuno");
  await expect(page.getByText("#").locator("nth=7")).toContainText("mewtwo");
  await expect(page.getByText("#").locator("nth=8")).toContainText(
    "mega-mewtwo-x",
  );
  await expect(page.getByText("#").locator("nth=9")).toContainText(
    "mega-mewtwo-y",
  );
  await expect(page.getByText("#").locator("nth=10")).not.toBeVisible();
  await page.getByTestId("region-kanto-filter").click();

  // Johto Filter
  await page.getByTestId("region-johto-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("totodile");
  await expect(page.getByText("#").locator("nth=3")).toContainText("furret");
  await expect(page.getByText("#").locator("nth=4")).toContainText("togepi");
  await expect(page.getByText("#").locator("nth=5")).toContainText("sudowoodo");
  await expect(page.getByText("#").locator("nth=6")).toContainText("umbreon");
  await expect(page.getByText("#").locator("nth=7")).toContainText(
    "mega-heracross",
  );
  await expect(page.getByText("#").locator("nth=8")).toContainText("raikou");
  await expect(page.getByText("#").locator("nth=9")).toContainText("tyranitar");
  await expect(page.getByText("#").locator("nth=10")).toContainText("lugia");
  await expect(page.getByText("#").locator("nth=11")).not.toBeVisible();
  await page.getByTestId("region-johto-filter").click();

  // Hoenn Filter
  await page.getByTestId("region-hoenn-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("grovyle");
  await expect(page.getByText("#").locator("nth=3")).toContainText("gardevoir");
  await expect(page.getByText("#").locator("nth=4")).toContainText(
    "mega-mawile",
  );
  await expect(page.getByText("#").locator("nth=5")).toContainText("castform");
  await expect(page.getByText("#").locator("nth=6")).toContainText(
    "castform-rainy",
  );
  await expect(page.getByText("#").locator("nth=7")).toContainText(
    "castform-snowy",
  );
  await expect(page.getByText("#").locator("nth=8")).toContainText(
    "castform-sunny",
  );
  await expect(page.getByText("#").locator("nth=9")).toContainText("walrein");
  await expect(page.getByText("#").locator("nth=10")).toContainText(
    "metagross",
  );
  await expect(page.getByText("#").locator("nth=11")).toContainText("kyogre");
  await expect(page.getByText("#").locator("nth=12")).toContainText(
    "primal-kyogre",
  );
  await expect(page.getByText("#").locator("nth=13")).not.toBeVisible();
  await page.getByTestId("region-hoenn-filter").click();

  // Sinnoh Filter
  await page.getByTestId("region-sinnoh-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText(
    "shellos-east",
  );
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "shellos-west",
  );
  await expect(page.getByText("#").locator("nth=4")).toContainText(
    "hippowdon-f",
  );
  await expect(page.getByText("#").locator("nth=5")).toContainText(
    "hippowdon-m",
  );
  await expect(page.getByText("#").locator("nth=6")).toContainText("rotom");
  await expect(page.getByText("#").locator("nth=7")).toContainText("rotom-fan");
  await expect(page.getByText("#").locator("nth=8")).toContainText(
    "rotom-frost",
  );
  await expect(page.getByText("#").locator("nth=9")).toContainText(
    "rotom-heat",
  );
  await expect(page.getByText("#").locator("nth=10")).toContainText(
    "rotom-mow",
  );
  await expect(page.getByText("#").locator("nth=11")).toContainText(
    "rotom-wash",
  );
  await expect(page.getByText("#").locator("nth=12")).not.toBeVisible();
  await page.getByTestId("region-sinnoh-filter").click();

  // Unova Filter
  await page.getByTestId("region-unova-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("victini");
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "basculin-blue-striped",
  );
  await expect(page.getByText("#").locator("nth=4")).toContainText(
    "basculin-red-striped",
  );
  await expect(page.getByText("#").locator("nth=5")).toContainText("ducklett");
  await expect(page.getByText("#").locator("nth=6")).not.toBeVisible();
  await page.getByTestId("region-unova-filter").click();

  // Kalos Filter
  await page.getByTestId("region-kalos-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("greninja");
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "ash-greninja",
  );
  await expect(page.getByText("#").locator("nth=4")).toContainText(
    "meowstic-female",
  );
  await expect(page.getByText("#").locator("nth=5")).toContainText(
    "meowstic-male",
  );
  await expect(page.getByText("#").locator("nth=6")).not.toBeVisible();
  await page.getByTestId("region-kalos-filter").click();

  await context.close();
  await page.close();
});

test("rarity filters", async ({ browser }) => {
  const [page, context] = await login(browser, 1);

  // Sort By Pokedex # For Simplicity
  await page.getByTestId("pokedex-sort").click();

  // Common Filter
  await expect(page.getByTestId("rarity-common-filter")).not.toBeVisible();
  await page.getByTestId("rarity-filter").click();
  await expect(page.getByTestId("rarity-common-filter")).toBeVisible();
  await page.getByTestId("rarity-all-filter").click();
  await expect(page.getByText("#").locator("nth=2")).not.toBeVisible();
  await page.getByTestId("rarity-common-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("caterpie");
  await expect(page.getByText("#").locator("nth=3")).toContainText("furret");
  await expect(page.getByText("#").locator("nth=4")).toContainText("sudowoodo");
  await expect(page.getByText("#").locator("nth=5")).toContainText("umbreon");
  await expect(page.getByText("#").locator("nth=6")).toContainText("castform");
  await expect(page.getByText("#").locator("nth=7")).toContainText(
    "castform-rainy",
  );
  await expect(page.getByText("#").locator("nth=8")).toContainText(
    "castform-snowy",
  );
  await expect(page.getByText("#").locator("nth=9")).toContainText(
    "castform-sunny",
  );
  await expect(page.getByText("#").locator("nth=10")).toContainText(
    "shellos-east",
  );
  await expect(page.getByText("#").locator("nth=11")).toContainText(
    "shellos-west",
  );
  await expect(page.getByText("#").locator("nth=12")).toContainText("rotom");
  await expect(page.getByText("#").locator("nth=13")).toContainText(
    "rotom-fan",
  );
  await expect(page.getByText("#").locator("nth=14")).toContainText(
    "rotom-frost",
  );
  await expect(page.getByText("#").locator("nth=15")).toContainText(
    "rotom-heat",
  );
  await expect(page.getByText("#").locator("nth=16")).toContainText(
    "rotom-mow",
  );
  await expect(page.getByText("#").locator("nth=17")).toContainText(
    "rotom-wash",
  );
  await expect(page.getByText("#").locator("nth=18")).toContainText(
    "basculin-blue-striped",
  );
  await expect(page.getByText("#").locator("nth=19")).toContainText(
    "basculin-red-striped",
  );
  await expect(page.getByText("#").locator("nth=20")).toContainText("ducklett");
  await expect(page.getByText("#").locator("nth=21")).toContainText(
    "meowstic-female",
  );
  await expect(page.getByText("#").locator("nth=22")).toContainText(
    "meowstic-male",
  );
  await expect(page.getByText("#").locator("nth=23")).not.toBeVisible();
  await page.getByTestId("rarity-common-filter").click();

  // Rare Filter
  await page.getByTestId("rarity-rare-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("venusaur");
  await expect(page.getByText("#").locator("nth=3")).toContainText("totodile");
  await expect(page.getByText("#").locator("nth=4")).toContainText("togepi");
  await expect(page.getByText("#").locator("nth=5")).toContainText("grovyle");
  await expect(page.getByText("#").locator("nth=6")).toContainText("walrein");
  await expect(page.getByText("#").locator("nth=7")).toContainText("greninja");
  await expect(page.getByText("#").locator("nth=8")).not.toBeVisible();
  await page.getByTestId("rarity-rare-filter").click();

  // Epic Filter
  await page.getByTestId("rarity-epic-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("growlithe");
  await expect(page.getByText("#").locator("nth=3")).toContainText("tyranitar");
  await expect(page.getByText("#").locator("nth=4")).toContainText("gardevoir");
  await expect(page.getByText("#").locator("nth=5")).toContainText("metagross");
  await expect(page.getByText("#").locator("nth=6")).toContainText(
    "hippowdon-f",
  );
  await expect(page.getByText("#").locator("nth=7")).toContainText(
    "hippowdon-m",
  );
  await expect(page.getByText("#").locator("nth=8")).not.toBeVisible();
  await page.getByTestId("rarity-epic-filter").click();

  // Legendary Filter
  await page.getByTestId("rarity-legendary-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText("articuno");
  await expect(page.getByText("#").locator("nth=3")).toContainText("mewtwo");
  await expect(page.getByText("#").locator("nth=4")).toContainText("raikou");
  await expect(page.getByText("#").locator("nth=5")).toContainText("lugia");
  await expect(page.getByText("#").locator("nth=6")).toContainText("kyogre");
  await expect(page.getByText("#").locator("nth=7")).toContainText("victini");
  await expect(page.getByText("#").locator("nth=8")).toContainText(
    "ash-greninja",
  );
  await expect(page.getByText("#").locator("nth=9")).not.toBeVisible();
  await page.getByTestId("rarity-legendary-filter").click();

  // Mega Filter
  await page.getByTestId("rarity-mega-filter").click();
  await expect(page.getByText("#").locator("nth=2")).toContainText(
    "mega-venusaur",
  );
  await expect(page.getByText("#").locator("nth=3")).toContainText(
    "mega-mewtwo-x",
  );
  await expect(page.getByText("#").locator("nth=4")).toContainText(
    "mega-mewtwo-y",
  );
  await expect(page.getByText("#").locator("nth=5")).toContainText(
    "mega-heracross",
  );
  await expect(page.getByText("#").locator("nth=6")).toContainText(
    "mega-mawile",
  );
  await expect(page.getByText("#").locator("nth=7")).toContainText(
    "primal-kyogre",
  );
  await expect(page.getByText("#").locator("nth=8")).not.toBeVisible();
  await page.getByTestId("rarity-mega-filter").click();

  await context.close();
  await page.close();
});
