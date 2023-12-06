import { db } from "@/src/server/db/index";
import { NextApiRequest, NextApiResponse } from "next";
import { profiles } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { MAX_BALANCE } from "@/src/constants";
import { env } from "@/src/env";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers;
  if (!authorization || authorization.split(" ")[1] !== env.CRON_TOKEN) {
    throw new Error("Not authorized to make this request.");
  }
  switch (req.method) {
    case "POST":
      try {
        const profilesData = await db.select().from(profiles);

        for (const profile of profilesData) {
          const newBalance =
            profile.balance + profile.totalYield > MAX_BALANCE
              ? MAX_BALANCE
              : profile.balance + profile.totalYield;

          await db
            .update(profiles)
            .set({
              balance: newBalance,
              claimedDaily: false,
              claimedNightly: false
            })
            .where(eq(profiles.id, profile.id));
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
