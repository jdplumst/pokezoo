import "server-only";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { type Theme, ZodTheme } from "~/lib/types";

export async function setTheme(theme: Theme) {
  const result = ZodTheme.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  const cookieStore = await cookies();
  cookieStore.set({
    name: "theme",
    value: parsedTheme,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  revalidatePath("/settings");
}
