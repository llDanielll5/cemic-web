"use server";

import axiosInstance from "@/axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { APIResponse } from "types/utils";

export default async function registerNewUser(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  const { startDate, endDate, filial, jwt } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).send({
      error: {
        details: "Envie uma data de início e fim da apuração",
        status: 400,
      },
    });
  }

  const { data } = await axiosInstance.get(
    `/cashiers/?filters[$and][0][date][$gte]=${startDate}&filters[$and][1][date][$lte]=${endDate}&filters[filial][$eq]=${filial}&populate[cashierInfos][populate]=*&populate[adminInfos][populate]=*`,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );

  const monthCashArr = data.data;

  if (monthCashArr.length === 0)
    res.status(200).json({
      data: {
        totalDebit: 0,
        totalCash: 0,
        totalCredit: 0,
        totalOut: 0,
        totalPix: 0,
        totalBankCheck: 0,
        totalTransfer: 0,
      },
    });

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

  return res.status(200).send({
    data: {
      totalDebit,
      totalCash,
      totalCredit,
      totalOut,
      totalPix,
      totalBankCheck,
      totalTransfer,
    },
  });
}
