"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
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

export async function setTimezone(timezone: string, offset: string) {
  const cookieStore = await cookies();
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
  const cookieStore = await cookies();
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
