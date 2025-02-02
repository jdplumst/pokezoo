"use server";
import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/server/auth";

export async function isAuthed() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  return session;
}
