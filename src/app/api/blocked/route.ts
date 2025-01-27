import type { NextApiRequest, NextApiResponse } from "next";

export function GET(_req: NextApiRequest, res: NextApiResponse) {
  res.status(429);
  return res.end();
}
