import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { timezones } from "@/utils/timezones";

const themeSchema = z.enum(["blue", "purple", "green", "orange"]);

export function getTheme() {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme")?.value ?? "blue";
  const result = themeSchema.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  return parsedTheme;
}

export function setTheme(theme: string) {
  const result = themeSchema.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  const cookieStore = cookies();
  cookieStore.set("theme", parsedTheme);
  revalidatePath("/settings");
}

export function getTime() {
  const cookieStore = cookies();
  const timezone = cookieStore.get("timezone-offset")?.value ?? "-5";
  const parsedTimezone = Math.floor(Number(timezone)) || -5;
  const hour = new Date().getUTCHours() + parsedTimezone;
  let time: "day" | "night" = "day";
  if (hour < 6 || hour > 17) {
    time = "night";
  }
  return time;
}

export function getTimezone() {
  const cookieStore = cookies();
  let timezone =
    cookieStore.get("timezone")?.value ??
    "Eastern Standard Time (North America) [EST -5]";
  const isRealTimezone = timezones.findIndex((t) => t.name === timezone);
  if (isRealTimezone === -1) {
    timezone = "Eastern Standard Time (North America) [EST -5]";
  }
  return timezone;
}

export function setTimezone(timezone: string, offset: string) {
  const cookieStore = cookies();
  cookieStore.set("timezone", timezone);
  cookieStore.set("timezone-offset", offset);
  revalidatePath("/settings");
}

export function toggleTime() {
  const cookieStore = cookies();
  const timezone = cookieStore.get("timezone")?.value ?? "Fiji Time [FJT +12]";
  if (timezone === "Fiji Time [FJT +12]") {
    cookieStore.set("timezone", "Coordinated Universal Time [UTC 0]");
    cookieStore.set("timezone-offset", "0");
  } else {
    cookieStore.set("timezone", "Fiji Time [FJT +12]");
    cookieStore.set("timezone-offset", "12");
  }
}
