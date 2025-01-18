import "server-only";

import { cookies } from "next/headers";

export async function getTime() {
  const cookieStore = await cookies();
  const timeZone = cookieStore.get("timezone")?.value || "-5";
  const parsedTimeZone = parseInt(timeZone) || 5;
  const hour = new Date().getHours() + parsedTimeZone;
  let time: "day" | "night" = "day";
  if (hour < 6 || hour > 17) {
    time = "night";
  }
  return time;
}
