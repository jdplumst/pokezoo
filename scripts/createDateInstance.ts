// @ts-nocheck

import { prisma } from "../src/server/db";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const backfillCreateDateInstance = async () => {
  const instances = await prisma.instance.findMany();
  for (const i of instances) {
    await delay(1000);
    await prisma.instance.update({
      data: { createDate: new Date() },
      where: { id: i.id }
    });
  }
};

backfillCreateDateInstance();
