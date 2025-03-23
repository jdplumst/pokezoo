import "server-only";

import { and, eq, gte } from "drizzle-orm";
import { db } from "~/server/db";
import { isAuthed } from "~/server/db/queries/auth";
import { instances } from "~/server/db/schema";

export async function getAvailableBox() {
  const session = await isAuthed();

  const instanceData = await db
    .select()
    .from(instances)
    .where(and(eq(instances.userId, session.user.id), gte(instances.box, 1)));

  for (let i = 0; i < 30; i++) {
    const box = instanceData.filter((instance) => instance.box === i + 1);
    if (box.length < 30) {
      return i + 1;
    }
  }

  return false;
}
