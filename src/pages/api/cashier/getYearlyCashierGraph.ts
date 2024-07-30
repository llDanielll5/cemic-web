"use server";

import axiosInstance from "@/axios";
import { endOfMonth, formatISO, startOfMonth } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { APIResponse } from "types/utils";

const getMonthValues = async (
  startDate: string,
  endDate: string,
  filial: string,
  jwt: string
) => {
  const { data } = await axiosInstance.get(
    `/cashiers/?filters[$and][0][date][$gte]=${startDate}&filters[$and][1][date][$lte]=${endDate}&filters[filial][$eq]=${filial}&populate[cashierInfos][populate]=*&populate[adminInfos][populate]=*`,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );

  const monthCashArr = data.data;

  if (monthCashArr.length === 0) return;

  let monthCash: any[] = monthCashArr.map(
    (v: any) => v.attributes.total_values.cash
  );
  let monthDebit: any[] = monthCashArr.map(
    (v: any) => v.attributes.total_values.debit
  );
  let monthCredit: any[] = monthCashArr.map(
    (v: any) => v.attributes.total_values.credit
  );
  let monthPix: any[] = monthCashArr.map(
    (v: any) => v.attributes.total_values.pix
  );
  let monthBankCheck: any[] = monthCashArr.map(
    (v: any) => v.attributes.total_values.bank_check
  );
  let monthTransfer: any[] = monthCashArr.map(
    (v: any) => v.attributes.total_values.transfer
  );
  let monthOut: any[] = monthCashArr.map(
    (v: any) => v.attributes.total_values.out
  );

  let totalCash = 0;
  let totalDebit = 0;
  let totalCredit = 0;
  let totalPix = 0;
  let totalOut = 0;
  let totalBankCheck = 0;
  let totalTransfer = 0;

  totalCash = monthCash.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  totalDebit = monthDebit.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  totalCredit = monthCredit.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  totalPix = monthPix.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  totalOut = monthOut.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  totalBankCheck = monthBankCheck.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
  totalTransfer = monthTransfer.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  const total =
    totalDebit +
    totalCash +
    totalCredit +
    totalPix +
    totalBankCheck +
    totalTransfer -
    totalOut;

  return total;
};

export default async function registerNewUser(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  const { filial, jwt } = req.body;

  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  let monthResults: { brasilia: any; uberlandia: any } = {
    brasilia: {
      jan: 0,
      fev: 0,
      mar: 0,
      abr: 0,
      mai: 0,
      jun: 0,
      jul: 0,
      ago: 0,
      set: 0,
      out: 0,
      nov: 0,
      dez: 0,
    },
    uberlandia: {
      jan: 0,
      fev: 0,
      mar: 0,
      abr: 0,
      mai: 0,
      jun: 0,
      jul: 0,
      ago: 0,
      set: 0,
      out: 0,
      nov: 0,
      dez: 0,
    },
  };
  let finish = false;

  for (let i = 0; i < months.length; i++) {
    const date = new Date(new Date().getFullYear(), i, 1);
    const startDate = formatISO(startOfMonth(date)).substring(0, 10);
    const endDate = formatISO(endOfMonth(date)).substring(0, 10);

    const values = await getMonthValues(startDate, endDate, "Brasilia", jwt);
    let total = values;
    monthResults.brasilia[months[i]] = total === undefined ? 0 : total;
  }
  for (let i = 0; i < months.length; i++) {
    const date = new Date(new Date().getFullYear(), i, 1);
    const startDate = formatISO(startOfMonth(date)).substring(0, 10);
    const endDate = formatISO(endOfMonth(date)).substring(0, 10);

    const values = await getMonthValues(startDate, endDate, "Uberlandia", jwt);
    let total = values;
    monthResults.uberlandia[months[i]] = total === undefined ? 0 : total;
    if (months[i] === "dez") finish = true;
  }

  if (finish) {
    return res.status(200).send({
      data: { monthResults },
    });
  }
}
