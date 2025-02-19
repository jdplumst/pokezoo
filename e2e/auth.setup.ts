import { test as setup } from "@playwright/test";
import { env } from "~/env";

const greenFile = "playwright/.auth/green.json";

setup("authenticate as green", async ({ page, context }) => {
  await page.goto("./game");
  await context.addCookies([
    {
      name: env.COOKIE_NAME!,
      value: env.GREEN_SESSION!,
      url: env.NEXTAUTH_URL,
    },
  ]);
  await page.reload();
  await page.waitForURL("./onboarding");

  await page.context().storageState({ path: greenFile });
});

const redFile = "playwright/.auth/red.json";

setup("authenticate as red", async ({ page, context }) => {
  await page.goto("./game");
  await context.addCookies([
    {
      name: env.COOKIE_NAME!,
      value: env.RED_SESSION!,
      url: env.NEXTAUTH_URL,
    },
  ]);
  await page.reload();
  await page.waitForURL("./game");

  await page.context().storageState({ path: redFile });
});

const blueFile = "playwright/.auth/blue.json";

setup("authenticate as blue", async ({ page, context }) => {
  await page.goto("./game");
  await context.addCookies([
    {
      name: env.COOKIE_NAME!,
      value: env.BLUE_SESSION!,
      url: env.NEXTAUTH_URL,
    },
  ]);
  await page.reload();
  await page.waitForURL("./game");

  await page.context().storageState({ path: blueFile });
});
