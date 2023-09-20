import { prisma } from "@/src/server/db";
import { NextApiRequest, NextApiResponse } from "next";

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
        const users = await prisma.user.findMany();
        for (const user of users) {
          const newBalance =
            user.balance + user.totalYield > 1000000000
              ? 1000000000
              : user.balance + user.totalYield;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              balance: newBalance,
              claimedDaily: false,
              claimedNightly: false
            }
          });
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
