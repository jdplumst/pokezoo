import { db } from "@/src/server/db/index";
import { type NextApiRequest, type NextApiResponse } from "next";
import { profiles } from "@/src/server/db/schema";
import { eq } from "drizzle-orm";
import { MAX_BALANCE } from "@/src/constants";
import { env } from "@/src/env";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { authorization } = req.headers;
  if (!authorization || authorization.split(" ")[1] !== env.CRON_TOKEN) {
    throw new Error("Not authorized to make this request.");
  }
  switch (req.method) {
    case "POST":
      try {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;

        let completedEvent = null;

        if (
          (day === 25 && month === 12) ||
          (day === 1 && month === 1) ||
          (day === 5 && month === 4)
        ) {
          completedEvent = false;
        } else if ((day === 8 && month === 1) || (day === 13 && month === 4)) {
          completedEvent = true;
        }

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
              claimedNightly: false,
              claimedEvent: completedEvent ?? profile.claimedEvent,
            })
            .where(eq(profiles.id, profile.id));
        }
        return res.status(200).json({
          msg: "Successfully updated all user's dollars and reset daily and nightly claims",
        });
      } catch (error) {
        throw new Error(
          "User's dollars and daily and nightly claims not updated successfully",
        );
      }
  }
}
