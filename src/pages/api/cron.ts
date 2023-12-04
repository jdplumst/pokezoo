import { db } from "@/src/server/db/index";
import { NextApiRequest, NextApiResponse } from "next";
import { user } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { MAX_BALANCE } from "@/src/constants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers;
  if (
    !authorization ||
    authorization.split(" ")[1] !== process.env.CRON_TOKEN
  ) {
    throw new Error("Not authorized to make this request.");
  }
  switch (req.method) {
    case "POST":
      try {
        const users = await db.select().from(user);

        for (const u of users) {
          const newBalance =
            u.balance + u.totalYield > MAX_BALANCE
              ? MAX_BALANCE
              : u.balance + u.totalYield;

          await db
            .update(user)
            .set({
              balance: newBalance,
              claimedDaily: false,
              claimedNightly: false
            })
            .where(eq(user.id, u.id));
        }
        return res.status(200).json({
          msg: "Successfully updated all user's dollars and reset daily and nightly claims"
        });
      } catch (error) {
        throw new Error(
          "User's dollars and daily and nightly claims not updated successfully"
        );
      }
  }
};
