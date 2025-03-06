import test, { expect } from "@playwright/test";

test("not logged in", async ({ page }) => {
  await page.goto("./");
  expect(page.url()).toContain("/");
  await page.goto("./onboarding");
  expect(page.url()).not.toContain("/onboarding");
  await page.goto("./game");
  expect(page.url()).not.toContain("/game");
  await page.goto("./shop");
  expect(page.url()).not.toContain("/shop");
  await page.goto("./quests");
  expect(page.url()).not.toContain("/quests");
  await page.goto("./achievements");
  expect(page.url()).not.toContain("/achievements");
  await page.goto("./pokedex");
  expect(page.url()).not.toContain("/pokedex");
  await page.goto("./trades");
  expect(page.url()).not.toContain("/trades");
  await page.goto("./tutorial");
  expect(page.url()).not.toContain("/tutorial");
  await page.goto("./patch-notes");
  expect(page.url()).not.toContain("/patch-notes");
  await page.goto("./settings");
  expect(page.url()).not.toContain("/settings");
});
