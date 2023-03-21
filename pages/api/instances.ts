import client from "@/prisma/script";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    switch (req.method) {
      case "POST":
        // Add a new SpeciesInstance
        const userId = session.user.id.toString();
        const { speciesId, newYield, totalYield } = req.body;
        try {
          const instance = await client.speciesInstances.create({
            data: { userId: userId, speciesId: speciesId }
          });
          await client.user.update({
            where: { id: userId },
            data: { totalYield: totalYield + newYield }
          });
          res.status(200).json({ instance: instance });
        } catch (error) {
          res.status(400).json({ error: error });
        }
    }
  } else {
    // Not Signed in
    res.status(401).json({ error: "Not authorized to make this request." });
  }
  res.end();
};
