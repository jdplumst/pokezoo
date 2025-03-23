import "server-only";

import { and, eq, gte } from "drizzle-orm";
import { db } from "~/server/db";
import { isAuthed } from "~/server/db/queries/auth";
import { instances } from "~/server/db/schema";

export async function getAvailableBoxes(quantity = 1) {
  const session = await isAuthed();

  const instanceData = await db
    .select()
    .from(instances)
    .where(and(eq(instances.userId, session.user.id), gte(instances.box, 1)));

  const boxes: number[] = [];
  for (let i = 0; i < 1; i++) {
    const box = instanceData.filter((instance) => instance.box === i + 1);
    if (box.length < 30) {
      for (let j = 0; j < 30 - box.length; j++) {
        boxes.push(i + 1);
      }
    }
    if (boxes.length >= quantity) {
      return boxes;
    }
  }

  return false;
}
