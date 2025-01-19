import "server-only";

import { authOptions } from "@/src/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function isAuthed() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
}
