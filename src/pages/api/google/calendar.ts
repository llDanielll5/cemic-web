import type { NextApiRequest, NextApiResponse } from "next";

type Data = { name: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return res.status(200).send({ name: "Whatsapp-bot" });
}
