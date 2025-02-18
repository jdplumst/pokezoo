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
