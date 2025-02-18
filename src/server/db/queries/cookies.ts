import "server-only";

import { cookies } from "next/headers";
import { ZodTheme } from "~/lib/types";
import { timezones } from "~/lib/timezones";

export async function getTheme() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "blue";
  const result = ZodTheme.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  return parsedTheme;
}

export async function getTime() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone-offset")?.value ?? "-5";
  const parsedTimezone = Math.floor(Number(timezone)) || -5;
  const hour = new Date().getUTCHours() + parsedTimezone;
  let time: "day" | "night" = "day";
  if (hour < 6 || hour > 17) {
    time = "night";
  }
  return time;
}

export async function getTimezone() {
  const cookieStore = await cookies();
  let timezone =
    cookieStore.get("timezone")?.value ??
    "Eastern Standard Time (North America) [EST -5]";
  const isRealTimezone = timezones.findIndex((t) => t.name === timezone);
  if (isRealTimezone === -1) {
    timezone = "Eastern Standard Time (North America) [EST -5]";
  }
  return timezone;
}
