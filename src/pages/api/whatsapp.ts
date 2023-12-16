// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// import { Message, Whatsapp, create } from "venom-bot";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return res.status(200).send({ name: "Whatsapp-bot" });
}

// create({
//   session: "cemic-bot",
//   disableWelcome: true,
// })
//   .then(async (client: Whatsapp) => await start(client))
//   .catch((err) => console.log(err));

// async function start(client: Whatsapp) {
//   client.onMessage(async (message: Message) => {
//     if (!message.body || message.isGroupMsg) return;

//     const response = "Olá!";

//     if (message.body === "oi" || message.body === "Oi") {
//       const hour = new Date().getHours();
//       let salud = "";
//       if (hour < 12) salud = "Bom dia";
//       else if (hour < 18) salud = "Boa tarde";
//       else salud = "Boa noite";

//       return await client.sendText(message.from, `${salud} como está?`);
//     } else if (message.body === "olá") {
//       return await client.sendText(message.from, response);
//     } else {
//       return;
//     }
//   });
// }
