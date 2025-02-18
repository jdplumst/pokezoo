import "server-only";

import { cookies } from "next/headers";
import { ZodTheme } from "~/lib/types";

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
