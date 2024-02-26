import React, { useCallback, useEffect, useState } from "react";
import { Box, Paper, Typography, styled } from "@mui/material";
import { getCreditDiscount } from "@/services/services";
import { parseToBrl } from "../../patient/modals/receipt-preview";
import { Scrollbar } from "@/components/new-admin/comps/scrollbar";

interface CashierBodyProps {
  cashierData: any;
  monthValues: {
    totalDebit: number;
    totalCash: number;
    totalCredit: number;
    totalPix: number;
    totalOut: number;
    totalBankCheck: number;
    totalTransfer: number;
  };
}

const CashierBody = (props: CashierBodyProps) => {
  const { cashierData, monthValues } = props;
  const [totalMonth, setTotalMonth] = useState<number>(0);
  const [totalDay, setTotalDay] = useState<number>(0);

  const dayValues = cashierData?.attributes?.total_values;

  const getMonthTotal = useCallback(() => {
    const {
      totalDebit,
      totalCash,
      totalCredit,
      totalPix,
      totalOut,
      totalBankCheck,
      totalTransfer,
    } = monthValues;

    let total = 0;
    let creditDiscounted = getCreditDiscount(totalCredit);

    total =
      totalDebit +
      totalCash +
      totalPix +
      creditDiscounted +
      totalBankCheck +
      totalTransfer;

    if (totalOut === 0) return setTotalMonth(total);
    else {
      total = total - totalOut;
      return setTotalMonth(total);
    }
  }, [monthValues]);

  const getDayTotal = useCallback(() => {
    if (!dayValues) return;
    const { debit, cash, credit, pix, out, bank_check, transfer } = dayValues;

    let total = 0;
    let creditDiscounted = getCreditDiscount(credit);

    total = debit + cash + pix + creditDiscounted + bank_check + transfer;

    if (out === 0) return setTotalDay(total);
    else {
      total = total - out;
      return setTotalDay(total);
    }
  }, [dayValues]);

  useEffect(() => {
    getMonthTotal();
    getDayTotal();
  }, [getMonthTotal, getDayTotal]);

  return (
    <Container>
      <InnerContainer elevation={9}>
        <Typography variant="h6" textAlign={"center"} color="goldenrod">
          Movimentação do Mês
        </Typography>

        <GridContainer>
          <Typography variant="subtitle2">
            Dinheiro: <b> {parseToBrl(monthValues?.totalCash)}</b>
          </Typography>
          <Typography variant="subtitle2">
            Débito: <b> {parseToBrl(monthValues?.totalDebit)}</b>
          </Typography>
          <Typography variant="subtitle2">
            Crédito:
            <b>
              {parseToBrl(monthValues?.totalCredit)}
              {`(${parseToBrl(getCreditDiscount(monthValues?.totalCredit))})`}
            </b>
          </Typography>

          <Typography variant="subtitle2">
            Pix: <b> {parseToBrl(monthValues?.totalPix)}</b>
          </Typography>
          <Typography variant="subtitle2">
            DOC/TED: <b> {parseToBrl(monthValues?.totalTransfer)}</b>
          </Typography>
          <Typography variant="subtitle2">
            Cheque: <b> {parseToBrl(monthValues?.totalBankCheck)}</b>
          </Typography>
          <Typography variant="subtitle2" color="red">
            Saída: <b> {parseToBrl(monthValues?.totalOut)}</b>
          </Typography>
          <Typography variant="subtitle2" color="black">
            Total/Mês: <b> {parseToBrl(totalMonth)}</b>
          </Typography>
        </GridContainer>
      </InnerContainer>

      <InnerContainer elevation={9}>
        <Typography variant="h6" textAlign={"center"} color="green">
          Movimentação do Dia
        </Typography>

        <GridContainer>
          <Typography variant="subtitle2">
            Dinheiro: <b> {parseToBrl(dayValues?.cash)}</b>
          </Typography>
          <Typography variant="subtitle2">
            Débito: <b> {parseToBrl(dayValues?.debit)}</b>
          </Typography>
          <Typography variant="subtitle2">
            Crédito:{" "}
            <b>
              {" "}
              {parseToBrl(dayValues?.credit)}{" "}
              {`( ${parseToBrl(getCreditDiscount(dayValues?.credit))})`}
            </b>
          </Typography>
          <Typography variant="subtitle2">
            Pix: <b> {parseToBrl(dayValues?.pix)}</b>
          </Typography>
          <Typography variant="subtitle2">
            DOC/TED: <b> {parseToBrl(dayValues?.transfer)}</b>
          </Typography>
          <Typography variant="subtitle2">
            Cheque: <b> {parseToBrl(dayValues?.bank_check)}</b>
          </Typography>
          <Typography variant="subtitle2" color="red">
            Saída : <b> {parseToBrl(dayValues?.out)}</b>
          </Typography>
          <Typography variant="subtitle2" color="black">
            Total/Dia: <b> {parseToBrl(totalDay)}</b>
          </Typography>
        </GridContainer>
      </InnerContainer>
    </Container>
  );
};

const Container = styled(Box)`
  width: 100%;
  overflow: auto;
`;
const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 0.3rem;
  grid-row-gap: 0.3rem;
`;

const InnerContainer = styled(Paper)`
  display: grid;
  min-width: 1000px;
  flex-direction: column;
  border: 2px solid #f5f5f5;
  background-color: #f5f5f5;
  column-gap: 0.5rem;
  row-gap: 1rem;
  border-radius: 4;
  padding: 1rem 2rem;
  margin-top: 2rem;
`;

export default CashierBody;
