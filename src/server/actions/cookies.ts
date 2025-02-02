/* eslint @typescript-eslint/require-await: 0 */
"use server";
import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { timezones } from "@/utils/timezones";

const themeSchema = z.enum(["blue", "purple", "green", "orange"]);

export async function getTheme() {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme")?.value ?? "blue";
  const result = themeSchema.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  return parsedTheme;
}

export async function setTheme(theme: string) {
  const result = themeSchema.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  const cookieStore = cookies();
  cookieStore.set({
    name: "theme",
    value: parsedTheme,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  revalidatePath("/settings");
}

export async function getTime() {
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

export async function getTimezone() {
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

export async function setTimezone(timezone: string, offset: string) {
  const cookieStore = cookies();
  cookieStore.set({
    name: "timezone",
    value: timezone,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  cookieStore.set({
    name: "timezone-offset",
    value: offset,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  revalidatePath("/settings");
}

export async function toggleTime() {
  const cookieStore = cookies();
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
