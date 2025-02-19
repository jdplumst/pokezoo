/* eslint-disable react-hooks/rules-of-hooks */
import { expect, test as base } from "@playwright/test";
import { OnboardingPage } from "./models/onboarding";

type Fixtures = {
  onboardingPage: OnboardingPage;
};

export const test = base.extend<Fixtures>({
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },
});

test.use({ storageState: "./playwright/.auth/green.json" });

test.beforeEach(async ({ onboardingPage }) => {
  await onboardingPage.goto();
  await expect(onboardingPage.title).toBeVisible();
  await expect(onboardingPage.errorToast).not.toBeVisible();
});

test("no username and no starter", async ({ onboardingPage }) => {
  await onboardingPage.beginJourneyButton.click();
  await expect(onboardingPage.errorToast).toBeVisible();
  await expect(onboardingPage.errorToast).toContainText("Error");
  await expect(onboardingPage.errorToast).toContainText(
    "You must select a starter pokémon, and your username must be between 3 and 30 characters.",
  );
  await expect(onboardingPage.usernameInput).toHaveClass(/border-red-500/);
  await expect(onboardingPage.bulbasaur).toHaveClass(/border-red-500/);
  await expect(onboardingPage.charmander).toHaveClass(/border-red-500/);
  await expect(onboardingPage.squirtle).toHaveClass(/border-red-500/);
});

test("no username", async ({ onboardingPage }) => {
  await onboardingPage.bulbasaur.click();
  await onboardingPage.beginJourneyButton.click();
  await expect(onboardingPage.errorToast).toBeVisible();
  await expect(onboardingPage.errorToast).toContainText("Error");
  await expect(onboardingPage.errorToast).toContainText(
    "You must select a starter pokémon, and your username must be between 3 and 30 characters.",
  );
  await expect(onboardingPage.usernameInput).toHaveClass(/border-red-500/);
  await expect(onboardingPage.bulbasaur).toHaveClass(/border-red-500/);
  await expect(onboardingPage.charmander).toHaveClass(/border-red-500/);
  await expect(onboardingPage.squirtle).toHaveClass(/border-red-500/);
});

test("complete onboarding", async ({ page, onboardingPage }) => {
  await onboardingPage.usernameInput.fill("Green");
  await onboardingPage.bulbasaur.click();
  await onboardingPage.beginJourneyButton.click();
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
