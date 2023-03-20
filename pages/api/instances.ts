import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    // Signed in
    switch (req.method) {
      case "GET":
        // Fetch all user's instances here
        res
          .status(200)
          .json({ msg: "You are authorized to make this request!" });
    }
  } else {
    // Not Signed in
    res.status(401).json({ error: "Not authorized to make this request." });
  }
  res.end();
};
