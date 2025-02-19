import test, { expect } from "@playwright/test";

test.use({ storageState: "./playwright/.auth/green.json" });

test("complete onboarding", async ({ page }) => {
  await page.goto("./onboarding");
  await expect(
    page.getByRole("heading", { name: "Welcome to PokéZoo!" }),
  ).toBeVisible();
  await page.getByPlaceholder("Enter username").fill("Green");
  await page.getByRole("img", { name: "bulbasaur" }).click();
  await page.getByRole("button", { name: "Begin Journey" }).click();
  await expect(page.getByRole("main")).toContainText("Hi Green!");
  await expect(page.getByRole("main")).toContainText(
    "You have 1 / 2,000 Pokémon",
  );
  await expect(page.getByRole("main")).toContainText(
    "Your current balance is P500.",
  );
  await expect(page.getByRole("main")).toContainText(
    "You will receive P50 on the next payout.",
  );
  await expect(page.getByText("#1: bulbasaur")).toBeVisible();
});
