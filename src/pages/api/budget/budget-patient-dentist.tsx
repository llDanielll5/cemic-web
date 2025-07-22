// /pages/api/patient-budgets.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";
import axios from "axios";

const API_URL = process.env.DEV_SERVER_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const jwt = getCookie("jwt", { req, res });

  if (!jwt) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await axios.get(`${API_URL}/patient-budget-dentists`, {
      params: {
        "filters[isCompleted][$eq]": false,
        "populate[patient]": "*",
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Cache-Control: 60s para revalidação
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
    return res.status(200).json(response.data);
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.code === "ERR_CANCELED") {
      return res
        .status(504)
        .json({ error: "Timeout: servidor demorou para responder" });
    }
    console.error("Erro na API Route /patient-budgets:", err);
    return res.status(500).json({ error: "Erro ao buscar dados do servidor" });
  }
}
