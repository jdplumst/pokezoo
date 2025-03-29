import { test, expect } from "@playwright/test";
import { env } from "~/env";

test("home page contents", async ({ page }) => {
  console.log(env.NODE_ENV);
  await page.goto("./");
  await expect(page).toHaveTitle("PokéZoo");
  await expect(page.locator("h1")).toContainText("PokéZoo");
  await expect(page.locator("p")).toContainText(
    "Embark on an epic journey in your virtual Pokémon sanctuary! Collect rare Pokémon, earn points, and complete your Pokédex. Discover new species, level up your collection, and become the ultimate Pokémon Master in this thrilling, interactive experience!",
  );
});
