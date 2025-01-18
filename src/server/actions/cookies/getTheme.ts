import { cookies } from "next/headers";
import { z } from "zod";

const themeSchema = z.union([
  z.literal("blue"),
  z.literal("purple"),
  z.literal("orange"),
  z.literal("green"),
]);
export async function getTheme() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "blue";
  const result = themeSchema.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  return parsedTheme;
}
