import client from "@/prisma/script";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    switch (req.method) {
      case "PATCH":
        // Claim daily reward
        const userId = session.user.id.toString();
        const { balance } = req.body;
        try {
          const user = await client.user.update({
            where: { id: userId },
            data: { balance: balance + 25, claimedDaily: true }
          });
          return res.status(200).json({ user: user });
        } catch (error) {
          return res.status(400).json({ error: error });
        }
      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } else {
    // Not Signed in
    return res
      .status(401)
      .json({ error: "Not authorized to make this request." });
  }
};
