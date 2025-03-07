import test, { expect } from "@playwright/test";

test.describe("not logged in", () => {
  test("index", async ({ page }) => {
    await page.goto("./");
    expect(page.url()).toContain("/");
  });
  test("onboarding", async ({ page }) => {
    await page.goto("./onboarding");
    expect(page.url()).not.toContain("/onboarding");
  });
  test("game", async ({ page }) => {
    await page.goto("./game");
    expect(page.url()).not.toContain("/game");
  });
  test("shop", async ({ page }) => {
    await page.goto("./shop");
    expect(page.url()).not.toContain("/shop");
  });
  test("quests", async ({ page }) => {
    await page.goto("./quests");
    expect(page.url()).not.toContain("/quests");
  });
  test("achievements", async ({ page }) => {
    await page.goto("./achievements");
    expect(page.url()).not.toContain("/achievements");
  });
  test("pokedex", async ({ page }) => {
    await page.goto("./pokedex");
    expect(page.url()).not.toContain("/pokedex");
  });
  test("trades", async ({ page }) => {
    await page.goto("./trades");
    expect(page.url()).not.toContain("/trades");
  });
  test("tutorial", async ({ page }) => {
    await page.goto("./tutorial");
    expect(page.url()).not.toContain("/tutorial");
  });
  test("patch-notes", async ({ page }) => {
    await page.goto("./patch-notes");
    expect(page.url()).not.toContain("/patch-notes");
  });
  test("settings", async ({ page }) => {
    await page.goto("./settings");
    expect(page.url()).not.toContain("/settings");
  });
});

test.describe("logged in", () => {
  test.use({ storageState: "./playwright/.auth/red.json" });
  test("index", async ({ page }) => {
    await page.goto("./");
    expect(page.url()).toContain("/game");
  });
  test("onboarding", async ({ page }) => {
    await page.goto("./onboarding");
    expect(page.url()).toContain("/game");
  });
  test("game", async ({ page }) => {
    await page.goto("./game");
    expect(page.url()).toContain("/game");
  });
  test("shop", async ({ page }) => {
    await page.goto("./shop");
    expect(page.url()).toContain("/shop");
  });
  test("quests", async ({ page }) => {
    await page.goto("./quests");
    expect(page.url()).toContain("/quests");
  });
  test("achievements", async ({ page }) => {
    await page.goto("./achievements");
    expect(page.url()).toContain("/achievements");
  });
  test("pokedex", async ({ page }) => {
    await page.goto("./pokedex");
    expect(page.url()).toContain("/pokedex");
  });
  test("trades", async ({ page }) => {
    await page.goto("./trades");
    expect(page.url()).toContain("/trades");
  });
  test("tutorial", async ({ page }) => {
    await page.goto("./tutorial");
    expect(page.url()).toContain("/tutorial");
  });
  test("patch-notes", async ({ page }) => {
    await page.goto("./patch-notes");
    expect(page.url()).toContain("/patch-notes");
  });
  test("settings", async ({ page }) => {
    await page.goto("./settings");
    expect(page.url()).toContain("/settings");
  });
});
