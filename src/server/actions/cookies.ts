"use server";

import { cookies } from "next/headers";
import { type Theme } from "~/lib/types";
import { setTheme, setTimezone } from "~/server/db/mutations/cookies";

export async function setThemeAction(theme: Theme) {
  await setTheme(theme);
}

export async function setTimezoneAction(timezone: string, offset: string) {
  await setTimezone(timezone, offset);
}

export async function toggleTime() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value ?? "Fiji Time [FJT +12]";
  if (timezone === "Fiji Time [FJT +12]") {
    cookieStore.set({
      name: "timezone",
      value: "Coordinated Universal Time [UTC 0]",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    cookieStore.set({
      name: "timezone-offset",
      value: "0",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  } else {
    cookieStore.set({
      name: "timezone",
      value: "Fiji Time [FJT +12]",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    cookieStore.set({
      name: "timezone-offset",
      value: "12",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }
}
