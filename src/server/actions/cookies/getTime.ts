import { cookies } from "next/headers";

export async function getTime() {
  const cookieStore = await cookies();
  const timeZone = cookieStore.get("timezone")?.value || "-5";
  const parsedTimeZone = parseInt(timeZone) || 5;
  const hour = new Date().getHours() + parsedTimeZone;
  let time = "light";
  if (hour < 6 || hour > 17) {
    time = "dark";
  }
  return time;
}
