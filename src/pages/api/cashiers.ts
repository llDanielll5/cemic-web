// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-nocheck

import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  cashIn: number;
  out: number;
  cardIn: number;
  creditIn: number;
  description: string;
  name: string;
  pix: number;
  type: string;
  timestamp: Timestamp;
  idCashier: string;
  isChecked: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const filterName = req.body.name;
  const filterType = req.body.type;

  let data: any[] = [];
  let dataFiltered: any[] = [];
  const ref = collection(db, "cashiers_informations");
  const q = query(ref, where("type", "==", filterType));

  onSnapshot(q, (docs) => {
    docs.forEach((doc) => {
      data.push(doc.data());
    });
  });

  const filterByName = (name: string) => {
    let filtered = data.filter((e, i) => {
      let name = e.name.toLowerCase();
      return name.indexOf(filterName) !== -1;
    });
    dataFiltered = filtered;
  };

  filterByName(filterName);

  res.status(200).json(data);
}
