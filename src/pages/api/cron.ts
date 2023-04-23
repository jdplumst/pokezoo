import client from "@/prisma/script";
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
        await client.$executeRaw`UPDATE User SET balance = balance + totalYield, claimedDaily = false`;
        return res.status(200).json({
          msg: "Successfully updated all user's dollars and reset daily claim"
        });
      } catch (error) {
        throw new Error(
          "User's dollars and daily claim not updated successfully"
        );
      }
  }
};
