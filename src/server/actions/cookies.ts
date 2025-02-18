"use server";

import { type Theme } from "~/lib/types";
import {
  setTheme,
  setTimezone,
  toggleTime,
} from "~/server/db/mutations/cookies";

export async function setThemeAction(theme: Theme) {
  await setTheme(theme);
}

export async function setTimezoneAction(timezone: string, offset: string) {
  await setTimezone(timezone, offset);
}

export async function toggleTimeAction() {
  await toggleTime();
}
